const sb = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_PUBLISHABLE_KEY);
const newsGrid=document.querySelector('#newsGrid'), videoGrid=document.querySelector('#videoGrid'), matchGrid=document.querySelector('#matchGrid');
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
async function loadNews(){
  const {data,error}=await sb.from('news').select('id,title,slug,category,excerpt,image_url,author,published,views,created_at').eq('published',true).order('created_at',{ascending:false}).limit(12);
  if(error){console.error(error);newsGrid.innerHTML='<p>Could not load news.</p>';return}
  newsGrid.innerHTML=data?.length?data.map(n=>`<article class="card"><div class="thumb" ${n.image_url?`style="background-image:url('${esc(n.image_url)}');background-size:cover;background-position:center"`:''}>${n.image_url?'':'⚽'}</div><div class="pad"><span class="tag">${esc(n.category||'Football')}</span><h3>${esc(n.title)}</h3><p>${esc(n.excerpt||'')}</p></div></article>`).join(''):'<p>No published news yet.</p>';
}
function fallback(){videoGrid.innerHTML=['Highlights','Top Goals','Match Preview'].map(x=>`<article class="card"><div class="thumb">▶️</div><div class="pad"><span class="tag">Video</span><h3>${x}</h3><p>Videos can be added later.</p></div></article>`).join('');matchGrid.innerHTML=['Premier League','La Liga','Champions League'].map(x=>`<div class="match"><span class="tag">${x}</span><div class="teams"><span>Home</span><span class="score">VS</span><span>Away</span></div><p>Match fixtures can be added from Supabase.</p></div>`).join('')}
document.querySelector('#refreshNews').onclick=loadNews;
document.querySelector('#loginBtn').onclick=async()=>{const email=document.querySelector('#email').value.trim(),password=document.querySelector('#password').value;const msg=document.querySelector('#authMsg');if(!email||!password){msg.textContent='Enter email and password.';return}const {error}=await sb.auth.signInWithPassword({email,password});if(error){msg.textContent=error.message;return}const {data:{user}}=await sb.auth.getUser();const {data:admin}=await sb.from('admin_users').select('user_id').eq('user_id',user.id).maybeSingle();if(!admin){await sb.auth.signOut();msg.textContent='This account is not an admin.';return}location.href='admin.html'};
loadNews();fallback();
