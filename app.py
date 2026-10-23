import os, json, base64, hmac, hashlib, secrets, time, re, mimetypes
from datetime import datetime, timezone
from functools import wraps
from pathlib import Path
from urllib.parse import quote
import requests
from flask import Flask, request, jsonify, make_response, send_from_directory, abort
from werkzeug.security import generate_password_hash, check_password_hash

BASE = Path(__file__).resolve().parent
app = Flask(__name__, static_folder=None)
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024
COOKIE = 'n99_session'
SESSION_SECONDS = 8 * 60 * 60
DB_URL = os.environ.get('DATABASE_URL', '').strip()

# PostgreSQL is recommended on Vercel. SQLite is for local development only.
def db_conn():
    if DB_URL:
        import psycopg
        from psycopg.rows import dict_row
        return psycopg.connect(DB_URL, row_factory=dict_row)
    import sqlite3
    conn = sqlite3.connect(BASE / 'local-dev.sqlite3')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = db_conn()
    try:
        cur = conn.cursor()
        if DB_URL:
            cur.execute('''CREATE TABLE IF NOT EXISTS staff_users (id BIGSERIAL PRIMARY KEY, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('admin','site','staff')), active BOOLEAN NOT NULL DEFAULT TRUE, created_at TEXT NOT NULL)''')
        else:
            cur.execute('''CREATE TABLE IF NOT EXISTS staff_users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('admin','site','staff')), active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL)''')
        conn.commit()
        # Bootstrap admin from environment only if no admin exists. Password is hashed before storage.
        cur.execute("SELECT id FROM staff_users WHERE role='admin' LIMIT 1")
        if not cur.fetchone() and os.environ.get('ADMIN_USERNAME') and os.environ.get('ADMIN_PASSWORD'):
            username = os.environ['ADMIN_USERNAME'].strip()
            password = os.environ['ADMIN_PASSWORD']
            if len(password) >= 12 and len(username) >= 3:
                cur.execute('INSERT INTO staff_users (username,password_hash,role,active,created_at) VALUES (%s,%s,%s,%s,%s)' if DB_URL else 'INSERT INTO staff_users (username,password_hash,role,active,created_at) VALUES (?,?,?,?,?)', (username, generate_password_hash(password), 'admin', True if DB_URL else 1, datetime.now(timezone.utc).isoformat()))
                conn.commit()
        # Optional site/staff accounts can seed the database once; thereafter manage them in the UI.
        for role, uk, pk in [('site','SITE_USERNAME','SITE_PASSWORD'),('staff','STAFF_USERNAME','STAFF_PASSWORD')]:
            u,p = os.environ.get(uk,''), os.environ.get(pk,'')
            if u and p and len(p) >= 12:
                cur.execute('SELECT id FROM staff_users WHERE username=%s' if DB_URL else 'SELECT id FROM staff_users WHERE username=?', (u,))
                if not cur.fetchone():
                    cur.execute('INSERT INTO staff_users (username,password_hash,role,active,created_at) VALUES (%s,%s,%s,%s,%s)' if DB_URL else 'INSERT INTO staff_users (username,password_hash,role,active,created_at) VALUES (?,?,?,?,?)', (u,generate_password_hash(p),role,True if DB_URL else 1,datetime.now(timezone.utc).isoformat()))
                    conn.commit()
    finally: conn.close()

try: init_db()
except Exception as exc: app.logger.exception('Database initialization failed')

def secret():
    value=os.environ.get('SESSION_SECRET','')
    if len(value)<32: raise RuntimeError('SESSION_SECRET must be at least 32 characters.')
    return value.encode()

def make_token(username, role):
    payload=base64.urlsafe_b64encode(json.dumps({'user':username,'role':role,'exp':int(time.time())+SESSION_SECONDS},separators=(',',':')).encode()).decode().rstrip('=')
    sig=base64.urlsafe_b64encode(hmac.new(secret(),payload.encode(),hashlib.sha256).digest()).decode().rstrip('=')
    return payload+'.'+sig

def current_user():
    try:
        token=request.cookies.get(COOKIE,'')
        payload,sig=token.split('.',1)
        expected=base64.urlsafe_b64encode(hmac.new(secret(),payload.encode(),hashlib.sha256).digest()).decode().rstrip('=')
        if not hmac.compare_digest(sig,expected): return None
        data=json.loads(base64.urlsafe_b64decode(payload+'='*((4-len(payload)%4)%4)))
        if data.get('exp',0)<=time.time(): return None
        conn=db_conn()
        try:
            cur=conn.cursor(); cur.execute('SELECT id,username,role,active FROM staff_users WHERE username=%s' if DB_URL else 'SELECT id,username,role,active FROM staff_users WHERE username=?',(data['user'],)); row=cur.fetchone()
            if not row or not row['active'] or row['role']!=data['role']: return None
            return {'id':row['id'],'user':row['username'],'role':row['role']}
        finally: conn.close()
    except Exception: return None

def require_auth(*roles):
    def deco(fn):
        @wraps(fn)
        def wrapper(*args,**kwargs):
            user=current_user()
            if not user: return jsonify(error='Sign in required.'),401
            if roles and user['role'] not in roles: return jsonify(error='You do not have permission for this action.'),403
            request.current_user=user
            return fn(*args,**kwargs)
        return wrapper
    return deco

def secure(resp):
    resp.headers['X-Content-Type-Options']='nosniff'; resp.headers['X-Frame-Options']='DENY'; resp.headers['Referrer-Policy']='strict-origin-when-cross-origin'; resp.headers['Permissions-Policy']='camera=(), microphone=(), geolocation=()'; resp.headers['Cache-Control']='no-store'
    if request.path.startswith('/api/'): resp.headers['Content-Type']='application/json; charset=utf-8' if resp.is_json else resp.headers.get('Content-Type','application/json; charset=utf-8')
    return resp
@app.after_request
def add_headers(resp): return secure(resp)

def same_origin():
    origin=request.headers.get('Origin')
    if not origin: return request.headers.get('Sec-Fetch-Site')!='cross-site'
    host=request.host.lower()
    scheme = request.headers.get('X-Forwarded-Proto', request.scheme).lower()
    return origin.lower() == scheme + '://' + host

@app.get('/api/auth')
def auth_status():
    u=current_user()
    return jsonify(authenticated=bool(u),user=u['user'] if u else None,role=u['role'] if u else None,expiresIn=SESSION_SECONDS)
@app.post('/api/auth')
def auth_login():
    if not same_origin(): return jsonify(error='Request origin rejected.'),403
    data=request.get_json(silent=True) or {}; username=str(data.get('username','')).strip(); password=str(data.get('password',''))
    if not username or not password or len(username)>120 or len(password)>1024: return jsonify(error='Enter your username and password.'),400
    try:
        conn=db_conn()
        try:
            cur=conn.cursor(); cur.execute('SELECT username,password_hash,role,active FROM staff_users WHERE username=%s' if DB_URL else 'SELECT username,password_hash,role,active FROM staff_users WHERE username=?',(username,)); row=cur.fetchone()
            if not row or not row['active'] or not check_password_hash(row['password_hash'],password): return jsonify(error='Invalid username or password.'),401
            token=make_token(row['username'],row['role'])
            resp=make_response(jsonify(ok=True,authenticated=True,user=row['username'],role=row['role'],expiresIn=SESSION_SECONDS))
            resp.set_cookie(COOKIE,token,max_age=SESSION_SECONDS,httponly=True,secure=(request.is_secure or request.headers.get('X-Forwarded-Proto','').lower()=='https'),samesite='Strict',path='/')
            return resp
        finally: conn.close()
    except Exception: app.logger.exception('Login failed'); return jsonify(error='Authentication service is not configured correctly.'),503
@app.delete('/api/auth')
def auth_logout():
    r=make_response(jsonify(ok=True)); r.delete_cookie(COOKIE,path='/',secure=(request.is_secure or request.headers.get('X-Forwarded-Proto','').lower()=='https'),httponly=True,samesite='Strict'); return r

@app.get('/api/users')
@require_auth('admin')
def list_users():
    conn=db_conn()
    try:
        cur=conn.cursor(); cur.execute('SELECT id,username,role,active,created_at FROM staff_users ORDER BY id' if DB_URL else 'SELECT id,username,role,active,created_at FROM staff_users ORDER BY id')
        return jsonify(users=[dict(x) for x in cur.fetchall()])
    finally: conn.close()
@app.post('/api/users')
@require_auth('admin')
def create_user():
    if not same_origin(): return jsonify(error='Request origin rejected.'),403
    d=request.get_json(silent=True) or {}; username=str(d.get('username','')).strip(); password=str(d.get('password','')); role=str(d.get('role','staff'))
    if not re.fullmatch(r'[A-Za-z0-9._-]{3,50}',username): return jsonify(error='Username must be 3–50 letters, numbers, dots, underscores or hyphens.'),400
    if len(password)<12 or len(password)>1024: return jsonify(error='Password must be at least 12 characters.'),400
    if role not in ('staff','site','admin'): return jsonify(error='Invalid role.'),400
    if role=='admin' and request.current_user['role']!='admin': return jsonify(error='Only an administrator can create admin accounts.'),403
    conn=db_conn()
    try:
        cur=conn.cursor(); cur.execute('INSERT INTO staff_users (username,password_hash,role,active,created_at) VALUES (%s,%s,%s,%s,%s) RETURNING id' if DB_URL else 'INSERT INTO staff_users (username,password_hash,role,active,created_at) VALUES (?,?,?,?,?)', (username,generate_password_hash(password),role,True if DB_URL else 1,datetime.now(timezone.utc).isoformat()))
        row=cur.fetchone(); conn.commit(); return jsonify(ok=True,id=row['id'] if DB_URL else cur.lastrowid),201
    except Exception as e:
        conn.rollback()
        if 'unique' in str(e).lower() or 'duplicate' in str(e).lower(): return jsonify(error='That username already exists.'),409
        app.logger.exception('Create user failed'); return jsonify(error='Could not create account.'),500
    finally: conn.close()
@app.patch('/api/users/<int:user_id>')
@require_auth('admin')
def update_user(user_id):
    if not same_origin(): return jsonify(error='Request origin rejected.'),403
    d=request.get_json(silent=True) or {}; conn=db_conn()
    try:
        cur=conn.cursor(); cur.execute('SELECT id,username,role,active FROM staff_users WHERE id=%s' if DB_URL else 'SELECT id,username,role,active FROM staff_users WHERE id=?',(user_id,)); row=cur.fetchone()
        if not row: return jsonify(error='Account not found.'),404
        if row['role']=='admin' and row['username']==request.current_user['user'] and d.get('active') is False: return jsonify(error='You cannot disable your own account.'),400
        fields=[]; vals=[]
        if 'active' in d: fields.append('active=%s' if DB_URL else 'active=?'); vals.append(bool(d['active']) if DB_URL else (1 if d['active'] else 0))
        if 'role' in d:
            role=str(d['role'])
            if role not in ('admin','site','staff'): return jsonify(error='Invalid role.'),400
            if row['username']==request.current_user['user'] and role!='admin': return jsonify(error='You cannot demote your own account.'),400
            fields.append('role=%s' if DB_URL else 'role=?'); vals.append(role)
        if d.get('password'):
            pw=str(d['password'])
            if len(pw)<12: return jsonify(error='New password must be at least 12 characters.'),400
            fields.append('password_hash=%s' if DB_URL else 'password_hash=?'); vals.append(generate_password_hash(pw))
        if not fields: return jsonify(error='No changes provided.'),400
        vals.append(user_id); cur.execute('UPDATE staff_users SET '+','.join(fields)+(' WHERE id=%s' if DB_URL else ' WHERE id=?'),vals); conn.commit(); return jsonify(ok=True)
    finally: conn.close()
@app.delete('/api/users/<int:user_id>')
@require_auth('admin')
def delete_user(user_id):
    if not same_origin(): return jsonify(error='Request origin rejected.'),403
    conn=db_conn()
    try:
        cur=conn.cursor(); cur.execute('SELECT id,username,role FROM staff_users WHERE id=%s' if DB_URL else 'SELECT id,username,role FROM staff_users WHERE id=?',(user_id,)); row=cur.fetchone()
        if not row: return jsonify(error='Account not found.'),404
        if row['username']==request.current_user['user']: return jsonify(error='You cannot delete your own account.'),400
        cur.execute('DELETE FROM staff_users WHERE id=%s' if DB_URL else 'DELETE FROM staff_users WHERE id=?',(user_id,)); conn.commit(); return jsonify(ok=True)
    finally: conn.close()

# Public product catalogue remains read-only. Publishing goes to a separately configured GitHub repository.
@app.get('/api/catalog')
def catalog():
    p=BASE/'catalog.json'
    if not p.exists(): return jsonify(products=[],categories=[])
    return app.response_class(p.read_text(encoding='utf-8'),mimetype='application/json')
@app.get('/api/repo-file')
def repo_file():
    path=request.args.get('path','')
    if path not in ('catalog.json','data/log.json'): return jsonify(error='Path not allowed.'),403
    p=BASE/path
    if p.exists(): return jsonify(path=path,content=p.read_text(encoding='utf-8'))
    return jsonify(path=path,content='[]' if path.endswith('log.json') else '{"products":[],"categories":[]}')

@app.post('/api/save')
@require_auth('admin','site','staff')
def save():
    if not same_origin(): return jsonify(error='Request origin rejected.'),403
    d=request.get_json(silent=True) or {}; path=d.get('path',''); content=d.get('content'); binary=d.get('binary') is True
    if path!='catalog.json' and not re.fullmatch(r'images/shop/[A-Za-z0-9._-]+\.(?:jpe?g|png|webp)',str(path),re.I): return jsonify(error='This file path is not permitted.'),403
    is_image=path!='catalog.json'
    if is_image != binary or not isinstance(content,str) or not content: return jsonify(error='Invalid content or file type.'),400
    if len(content)>4_300_000: return jsonify(error='File too large.'),413
    if path=='catalog.json':
        try: obj=json.loads(content)
        except Exception: return jsonify(error='Catalog must be valid JSON.'),400
        if not isinstance(obj.get('products'),list) or not isinstance(obj.get('categories'),list): return jsonify(error='Catalog must include products and categories arrays.'),400
        seen=set()
        for p in obj['products']:
            if not isinstance(p,dict) or not isinstance(p.get('id'),str) or not p['id'] or p['id'] in seen or not isinstance(p.get('name'),str) or len(p['name'])>240: return jsonify(error='Invalid or duplicate product record.'),400
            try:
                if float(p.get('price',-1))<0: raise ValueError()
            except Exception: return jsonify(error='Invalid product price.'),400
            seen.add(p['id'])
        if request.current_user['role']!='admin':
            return jsonify(error='Only administrators may publish catalogue changes until per-action staff permissions are configured.'),403
    owner=os.environ.get('GITHUB_OWNER',''); repo=os.environ.get('GITHUB_REPO',''); branch=os.environ.get('GITHUB_BRANCH','main'); token=os.environ.get('GITHUB_TOKEN','')
    if not (owner and repo and token): return jsonify(error='Publishing is not configured. Set GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH and GITHUB_TOKEN for the testing repository.'),503
    if is_image:
        try: raw=base64.b64decode(content,validate=True)
        except Exception: return jsonify(error='Invalid image encoding.'),400
        if len(raw)>3_000_000: return jsonify(error='Image too large.'),413
        if not (raw.startswith(b'\xff\xd8\xff') or raw.startswith(b'\x89PNG\r\n\x1a\n') or (raw[:4]==b'RIFF' and raw[8:12]==b'WEBP')): return jsonify(error='Unsupported image type.'),400
        api_content=content
    else: api_content=base64.b64encode(content.encode()).decode()
    url=f'https://api.github.com/repos/{quote(owner)}/{quote(repo)}/contents/'+ '/'.join(quote(x,safe='') for x in path.split('/'))
    headers={'Authorization':'Bearer '+token,'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'}
    try:
        old=requests.get(url,headers=headers,params={'ref':branch},timeout=12); sha=old.json().get('sha') if old.status_code==200 else None
        if old.status_code not in (200,404): return jsonify(error='Could not read target file from GitHub.'),502
        payload={'message':str(d.get('message') or 'Update from 99 Computers console')[:140],'content':api_content,'branch':branch}
        if sha: payload['sha']=sha
        wr=requests.put(url,headers=headers,json=payload,timeout=20)
        if not wr.ok: return jsonify(error='GitHub rejected the publish. Check token permissions and repository configuration.'),502
        return jsonify(ok=True,sha=wr.json().get('content',{}).get('sha'),user=request.current_user['user'],role=request.current_user['role'])
    except requests.RequestException: return jsonify(error='Could not connect to GitHub.'),502

# Serve the existing frontend and assets without redesigning them.
@app.get('/')
def home(): return send_from_directory(BASE,'index.html')
@app.get('/<path:filename>')
def static_files(filename):
    if filename.startswith('api/'): abort(404)
    target=(BASE/filename).resolve()
    if BASE.resolve() not in target.parents and target!=BASE.resolve(): abort(404)
    if target.is_file(): return send_from_directory(BASE,filename)
    # SPA routes
    if filename in ('shop','services','about','why','contact') or filename.startswith('shop/'): return send_from_directory(BASE,'index.html')
    abort(404)

if __name__=='__main__': app.run(host='127.0.0.1',port=int(os.environ.get('PORT','5000')),debug=False)
