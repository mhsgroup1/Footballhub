const news=[['TRANSFER','Star forward completes a blockbuster move ahead of the new season','2h ago','⚡'],['CHAMPIONS LEAGUE','Five moments that changed a dramatic European night','4h ago','🏆'],['PREMIER LEAGUE','Managers reveal their biggest plans for the season','6h ago','🎙️'],['WORLD CUP','The young stars ready to take over international football','8h ago','🌍'],['TACTICS','Why high pressing is changing modern football','10h ago','🧠'],['MATCHDAY','Everything you need to know before kickoff','12h ago','🔥']];
const videos=[['Best goals of the week — unbelievable finishes','03:42','▶'],['Top 10 skills that broke the internet','05:18','▶'],['Last-minute winners you have to see','04:11','▶'],['Inside the dressing room after a huge win','06:02','▶'],['Young talents to watch this season','03:35','▶'],['The craziest football celebrations','04:48','▶']];
const matches=[['Real Madrid','Barcelona','20:00'],['Manchester City','Liverpool','21:00'],['Bayern Munich','Dortmund','21:30'],['Inter Milan','AC Milan','22:00']];
const newsGrid=document.querySelector('#newsGrid');news.forEach(n=>newsGrid.innerHTML+=`<article class="news-card"><div class="thumb">${n[3]}</div><div class="body"><div class="tag">${n[0]}</div><h3>${n[1]}</h3><div class="meta">${n[2]} · FootballHub</div></div></article>`);
const videoGrid=document.querySelector('#videoGrid');videos.forEach(v=>videoGrid.innerHTML+=`<article class="video"><div class="video-cover"><div class="play">${v[2]}</div><span class="duration">${v[1]}</span></div><div class="video-body"><h3>${v[0]}</h3></div></article>`);
const matchesGrid=document.querySelector('#matchesGrid');matches.forEach(m=>matchesGrid.innerHTML+=`<div class="match"><div class="teams">${m[0]} <span>vs</span> ${m[1]}</div><div class="time">${m[2]} · Today</div></div>`);
const modal=document.querySelector('#loginModal');document.querySelector('#loginBtn').onclick=()=>modal.classList.remove('hidden');document.querySelector('#closeModal').onclick=()=>modal.classList.add('hidden');document.querySelector('#searchBtn').onclick=()=>{const q=prompt('Search FootballHub');if(q)showToast('Search is ready — connect your content API to enable results.');};document.querySelector('#newsletterForm').onsubmit=e=>{e.preventDefault();showToast('Thanks! You are subscribed.');e.target.reset()};
let supabaseClient=null;
if(window.SUPABASE_URL&&window.SUPABASE_ANON_KEY&&window.supabase){
  supabaseClient=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
}

const loginBtn=document.querySelector('#loginBtn');
const authForm=document.querySelector('#authForm');
const emailInput=document.querySelector('#email');
const passwordInput=document.querySelector('#password');
const authStatus=document.querySelector('#authStatus');
const signupBtn=document.querySelector('#signupBtn');

function setLoggedInUI(user){
  if(user){
    loginBtn.textContent='Account';
    loginBtn.title=user.email || 'Signed in';
    loginBtn.onclick=()=>showAccountModal(user);
  }else{
    loginBtn.textContent='Login';
    loginBtn.title='Sign in';
    loginBtn.onclick=()=>modal.classList.remove('hidden');
  }
}

function showAccountModal(user){
  modal.classList.remove('hidden');
  document.querySelector('.modal-box').innerHTML=`
    <button class="close" id="closeAccount">×</button>
    <h2>Your account</h2>
    <p>You are signed in as:</p>
    <p style="font-weight:700;word-break:break-word">${escapeHtml(user.email || '')}</p>
    <button class="primary" type="button" id="logoutBtn">Log out</button>
    <p class="status" id="accountStatus"></p>`;
  document.querySelector('#closeAccount').onclick=()=>modal.classList.add('hidden');
  document.querySelector('#logoutBtn').onclick=async()=>{
    const {error}=await supabaseClient.auth.signOut();
    if(error){document.querySelector('#accountStatus').textContent=error.message;return;}
    modal.classList.add('hidden');
    showToast('You have been logged out.');
  };
}

function escapeHtml(value){
  return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

loginBtn.onclick=()=>modal.classList.remove('hidden');
document.querySelector('#closeModal').onclick=()=>modal.classList.add('hidden');

authForm.onsubmit=async e=>{
  e.preventDefault();
  if(!supabaseClient){authStatus.textContent='Supabase is not configured.';return;}
  const email=emailInput.value.trim(),password=passwordInput.value;
  authStatus.textContent='Signing in…';
  const {data,error}=await supabaseClient.auth.signInWithPassword({email,password});
  if(error){authStatus.textContent=error.message;return;}
  authStatus.textContent=`Signed in as ${data.user?.email || email}`;
  setLoggedInUI(data.user);
  setTimeout(()=>modal.classList.add('hidden'),700);
};

signupBtn.onclick=async()=>{
  if(!supabaseClient){authStatus.textContent='Supabase is not configured.';return;}
  const email=emailInput.value.trim(),password=passwordInput.value;
  if(!email||!password){authStatus.textContent='Enter email and password first.';return;}
  authStatus.textContent='Creating account…';
  const {data,error}=await supabaseClient.auth.signUp({email,password});
  if(error){authStatus.textContent=error.message;return;}
  if(data.session){
    authStatus.textContent=`Account created and signed in as ${data.user?.email || email}`;
    setLoggedInUI(data.user);
  }else{
    authStatus.textContent='Account created. Check your email and confirm your account, then sign in.';
  }
};

async function initAuth(){
  if(!supabaseClient){return;}
  const {data}=await supabaseClient.auth.getSession();
  setLoggedInUI(data.session?.user || null);
  supabaseClient.auth.onAuthStateChange((_event,session)=>{
    setLoggedInUI(session?.user || null);
  });
}
initAuth();

function showToast(t){const el=document.querySelector('#toast');el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2800)}
