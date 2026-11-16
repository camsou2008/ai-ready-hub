window.__AI4S_API__=Object.assign(window.__AI4S_API__||{},{"facets":{"layers":[],"countries":[],"signalLayers":[],"signalsPerDay":[],"latest":{"reports":null,"dailies":null,"cases":null,"signals":null}}});
window.__AI4S_API__=Object.assign(window.__AI4S_API__||{},{"signals":[]});
window.__AI4S_API__=Object.assign(window.__AI4S_API__||{},{"overview":{"counts":{"reports":0,"dailies":0,"weeklies":0,"articles":0,"cases":0,"signals":0},"runs":[],"signals":[],"latestWeeklies":[]}});
window.__AI4S_API__.overview=Object.assign(window.__AI4S_API__.overview||{},{"latestDailies":[]});
window.__AI4S_API__.overview=Object.assign(window.__AI4S_API__.overview||{},{"latestReports":[]});

;(function(){
  var DB = window.__AI4S_API__ || {};
  function matchQ(item,q,fields){
    q=(q||'').trim().toLowerCase(); if(!q) return true;
    for(var i=0;i<fields.length;i++){var v=item[fields[i]];
      if(v && String(v).toLowerCase().indexOf(q)!==-1) return true;}
    return false;
  }
  function paginate(arr,limit,offset){
    offset=offset||0;
    if(limit==null||isNaN(limit)) return arr.slice(offset);
    return arr.slice(offset,offset+limit);
  }
  function toInt(v,def){ v=parseInt(v==null?'':v,10); return isNaN(v)?def:v; }
  function handleSignals(sp){
    var items=(DB.signals||[]).slice();
    var days=toInt(sp.get('days'),0);
    if(days>0){
      var mx=''; for(var i=0;i<items.length;i++){var d=items[i].occurred_on||''; if(d>mx)mx=d;}
      if(mx){var cut=new Date(mx+'T00:00:00Z'); cut.setUTCDate(cut.getUTCDate()-(days-1));
        var cutS=cut.toISOString().slice(0,10);
        items=items.filter(function(s){return (s.occurred_on||'')>=cutS;});}
    }
    var layer=sp.get('layer');
    if(layer&&layer!=='\u5168\u90e8') items=items.filter(function(s){return s.layer===layer;});
    var q=sp.get('q')||'';
    items=items.filter(function(s){return matchQ(s,q,['org','summary','source_title','region']);});
    return {items:paginate(items,toInt(sp.get('limit'),60),toInt(sp.get('offset'),0))};
  }
  function handleCases(sp){
    var items=(DB.cases||[]).slice();
    var country=sp.get('country');
    if(country&&country!=='\u5168\u90e8') items=items.filter(function(c){return c.country===country;});
    var layer=sp.get('layer');
    if(layer&&layer!=='\u5168\u90e8') items=items.filter(function(c){return c.layer===layer;});
    var q=sp.get('q')||'';
    items=items.filter(function(c){return matchQ(c,q,['org','org_en','platform','highlights','country','source_title']);});
    return {items:paginate(items,toInt(sp.get('limit'),200),toInt(sp.get('offset'),0))};
  }
  function handleArticles(sp){
    var items=(DB.articles||[]).slice();
    var kind=sp.get('kind');
    if(kind) items=items.filter(function(a){return a.kind===kind;});
    var q=sp.get('q')||'';
    items=items.filter(function(a){return matchQ(a,q,['title','dek']);});
    items=paginate(items,sp.has('limit')?toInt(sp.get('limit'),null):null,toInt(sp.get('offset'),0));
    if(sp.get('body')==='1') items=items.map(function(a){return DB.articleDetails[a.slug]||DB.articleDetails[String(a.id)]||a;});
    return {items:items};
  }
  function route(path,sp){
    if(path==='/api/facets') return {status:200,body:DB.facets};
    if(path==='/api/overview') return {status:200,body:DB.overview};
    if(path==='/api/signals') return {status:200,body:handleSignals(sp)};
    if(path==='/api/cases') return {status:200,body:handleCases(sp)};
    if(path==='/api/articles') return {status:200,body:handleArticles(sp)};
    var m=path.match(/^\/api\/articles\/(.+)$/);
    if(m){var d=DB.articleDetails[decodeURIComponent(m[1])];
      if(d) return {status:200,body:d};
      return {status:404,body:{error:'not found'}};}
    return null;
  }
  var origFetch=window.fetch.bind(window);
  window.fetch=function(input,init){
    var urlStr=(typeof input==='string')?input:(input&&input.url);
    try{
      var u=new URL(urlStr,window.location.href);
      if(u.origin===window.location.origin&&u.pathname.indexOf('/api/')===0){
        var r=route(u.pathname,u.searchParams);
        if(r) return Promise.resolve(new Response(JSON.stringify(r.body),
          {status:r.status,headers:{'content-type':'application/json'}}));
      }
    }catch(e){}
    return origFetch(input,init);
  };
})();
