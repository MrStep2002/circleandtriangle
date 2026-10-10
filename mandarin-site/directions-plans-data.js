(function(){
const T=(pin,phon,role,gloss)=>({pin,phon,role,gloss});
const P=(en,punct,tokens)=>({en,punct,tokens,literal:tokens.map(t=>t.gloss).join(' / ')});
const V={
 wǒ:T('wǒ','waw','person','I'), nǐ:T('nǐ','nee','person','you'), wǒmen:T('wǒmen','waw-mun','person','we'),
 zài:T('zài','dzye','frame','at / in'), qù:T('qù','chyoo','frame','go'), xiǎng:T('xiǎng','shyahng','frame','want'),
 jiàn:T('jiàn','jyen','frame','meet / see'), ba:T('ba','bah','frame','suggestion marker'), ma:T('ma','mah','frame','question marker'),
 wǎng:T('wǎng','wahng','frame','towards'), zhuǎn:T('zhuǎn','jwan','frame','turn'), zǒu:T('zǒu','dzoh','frame','walk / go'),
 yīzhí:T('yīzhí','ee-jrr','frame','straight / continuously'), lí:T('lí','lee','frame','away from'), hěn:T('hěn','hun','frame','very'),
 qǐng:T('qǐng','ching','frame','please'), tíng:T('tíng','ting','frame','stop'), zěnme:T('zěnme','dzun-muh','frame','how'),
 zuò:T('zuò','dzwaw','frame','take / ride'), guò:T('guò','gwaw','frame','cross'), yǒu:T('yǒu','yoh','frame','have'),
 shàng:T('shàng','shahng','adj','up / above'), xià:T('xià','shyah','adj','down / below'), zuǒ:T('zuǒ','dzwaw','adj','left'), yòu:T('yòu','yoh','adj','right'),
 zuǒbian:T('zuǒbian','dzwaw-byen','adj','on the left'), yòubian:T('yòubian','yoh-byen','adj','on the right'),
 lǐmiàn:T('lǐmiàn','lee-myen','adj','inside'), wàimiàn:T('wàimiàn','wye-myen','adj','outside'),
 qiánmiàn:T('qiánmiàn','chyen-myen','adj','in front'), hòumiàn:T('hòumiàn','hoh-myen','adj','behind'),
 pángbiān:T('pángbiān','pahng-byen','adj','beside'), duìmiàn:T('duìmiàn','dway-myen','adj','opposite'),
 jìn:T('jìn','jin','adj','near'), yuǎn:T('yuǎn','ywen','adj','far'), cuò:T('cuò','tswaw','adj','wrong'),
 nǎr:T('nǎr','nar','thing','where'), zhèlǐ:T('zhèlǐ','juh-lee','thing','here'), nàr:T('nàr','nar','thing','there'),
 yínháng:T('yínháng','yeen-hahng','thing','bank'), shāngdiàn:T('shāngdiàn','shahng-dyen','thing','shop'),
 cèsuǒ:T('cèsuǒ','tsuh-swaw','thing','toilet'), yīyuàn:T('yīyuàn','ee-ywen','thing','hospital'),
 huǒchēzhàn:T('huǒchēzhàn','hwaw-chuh-jahn','thing','train station'), chāoshì:T('chāoshì','chow-shrr','thing','supermarket'),
 fànguǎn:T('fànguǎn','fahn-gwahn','thing','restaurant'), gōngyuán:T('gōngyuán','gohng-ywen','thing','park'),
 jīchǎng:T('jīchǎng','jee-chahng','thing','airport'), xuéxiào:T('xuéxiào','shweh-shyow','thing','school'),
 jiā:T('jiā','jyah','thing','home'), chūzūchē:T('chūzūchē','choo-dzoo-chuh','thing','taxi'),
 dìtiězhàn:T('dìtiězhàn','dee-tyeh-jahn','thing','metro station'), mǎlù:T('mǎlù','mah-loo','thing','road'),
 xiànzài:T('xiànzài','shyen-dzye','time','now'), jīntiān:T('jīntiān','jin-tyen','time','today'),
 míngtiān:T('míngtiān','ming-tyen','time','tomorrow'), jīnwǎn:T('jīnwǎn','jin-wahn','time','tonight'),
 zhōumò:T('zhōumò','joh-mwaw','time','weekend'), zǎoshang:T('zǎoshang','dzow-shahng','time','morning')
};
const places=[
 [V.yínháng,'bank'],[V.shāngdiàn,'shop'],[V.cèsuǒ,'toilet'],[V.yīyuàn,'hospital'],[V.huǒchēzhàn,'station'],
 [V.chāoshì,'supermarket'],[V.fànguǎn,'restaurant'],[V.gōngyuán,'park'],[V.jīchǎng,'airport'],[V.xuéxiào,'school'],[V.dìtiězhàn,'metro station']
];
const positions=[
 [V.zuǒbian,'on the left'],[V.yòubian,'on the right'],[V.lǐmiàn,'inside'],[V.wàimiàn,'outside'],
 [V.qiánmiàn,'in front'],[V.hòumiàn,'behind'],[V.pángbiān,'beside'],[V.duìmiàn,'opposite']
];
const times=[[V.jīntiān,'today'],[V.míngtiān,'tomorrow'],[V.jīnwǎn,'tonight'],[V.zhōumò,'at the weekend'],[V.zǎoshang,'in the morning']];
const positionPhrases=[]; places.forEach(([p,en])=>positions.forEach(([d,where])=>positionPhrases.push(P('The '+en+' is '+where+'.','.',[p,V.zài,d]))));
const directionPhrases=[
 P('Turn left.','.',[V.wǎng,V.zuǒ,V.zhuǎn]),P('Turn right.','.',[V.wǎng,V.yòu,V.zhuǎn]),
 P('Keep going straight.','.',[V.yīzhí,V.wǎng,V.qiánmiàn,V.zǒu]),P('Cross the road.','.',[V.guò,V.mǎlù]),
 P('It is not far.','.',[T('bù','boo','frame','not'),V.yuǎn]),P('It is very near.','.',[V.hěn,V.jìn])
];
places.forEach(([p,en])=>{
 directionPhrases.push(P('The '+en+' is ahead.','.',[p,V.zài,V.qiánmiàn]));
 directionPhrases.push(P('The '+en+' is behind us.','.',[p,V.zài,V.wǒmen,V.hòumiàn]));
 directionPhrases.push(P('The '+en+' is near here.','.',[p,V.lí,V.zhèlǐ,V.hěn,V.jìn]));
 directionPhrases.push(P('The '+en+' is far from here.','.',[p,V.lí,V.zhèlǐ,V.hěn,V.yuǎn]));
});
const planPhrases=[P('Where are you now?','?',[V.nǐ,V.xiànzài,V.zài,V.nǎr]),P("I'm at home.",'.',[V.wǒ,V.zài,V.jiā]),P('See you there.','.',[V.zài,V.nàr,V.jiàn])];
times.forEach(([time,when])=>{
 places.slice(0,8).forEach(([p,en])=>{
  planPhrases.push(P("I'll go to the "+en+' '+when+'.','.',[V.wǒ,time,V.qù,p]));
  planPhrases.push(P("Let's meet at the "+en+' '+when+'.','.',[V.wǒmen,time,V.zài,p,V.jiàn,V.ba]));
 });
 planPhrases.push(P('Are you free '+when+'?','?',[V.nǐ,time,V.yǒu,T('kòng','kohng','thing','free time'),V.ma]));
});
const travelPhrases=[]; places.forEach(([p,en])=>{
 travelPhrases.push(P('I want to go to the '+en+'.','.',[V.wǒ,V.xiǎng,V.qù,p]));
 travelPhrases.push(P('Is the '+en+' far?','?',[p,V.yuǎn,V.ma]));
 travelPhrases.push(P('How do I get to the '+en+'?','?',[V.zěnme,V.qù,p]));
 travelPhrases.push(P("Let's take a taxi to the "+en+'.','.',[V.wǒmen,V.zuò,V.chūzūchē,V.qù,p]));
});
positions.slice(0,6).forEach(([d,where])=>travelPhrases.push(P('Please stop '+where+'.','.',[V.qǐng,V.zài,d,V.tíng])));
travelPhrases.push(P("I'm going the wrong way.",'.',[V.wǒ,V.zǒu,V.cuò,T('le','luh','frame','change marker')]));
const vocabulary=Object.values(V).filter((v,i,a)=>a.findIndex(x=>x.pin===v.pin)===i);
const otherVocabulary=[
 T('chá','chah','thing','tea'),T('mǐfàn','mee-fahn','thing','rice'),T('shū','shoo','thing','book'),T('shǒujī','shoh-jee','thing','phone'),
 T('lǎoshī','laow-shrr','person','teacher'),T('péngyou','pung-yoh','person','friend'),T('hǎo','how','adj','good'),T('lèi','lay','adj','tired'),
 T('chī','chrr','frame','eat'),T('hē','huh','frame','drink'),T('kàn','kahn','frame','look'),T('shuō','shwaw','frame','speak'),
 T('xièxie','shyeh-shyeh','frame','thanks'),T('dà','dah','adj','big'),T('xiǎo','shyow','adj','small')
];
const quickWords=[V.zuǒbian,V.yòubian,V.shàng,V.xià,V.qiánmiàn,V.hòumiàn,V.lǐmiàn,V.wàimiàn,V.pángbiān,V.duìmiàn,V.jìn,V.yuǎn,V.nǎr,V.zhèlǐ,V.nàr,V.yīzhí];
window.DP_DATA={vocabulary,otherVocabulary,quickWords,topics:[
 {id:'position',name:'Where things are',emoji:'📍',sub:'Random places and positions',phrases:positionPhrases},
 {id:'directions',name:'Giving directions',emoji:'🧭',sub:'Turn, continue, near and far',phrases:directionPhrases},
 {id:'plans',name:'Making simple plans',emoji:'📅',sub:'Random places, times and meetings',phrases:planPhrases},
 {id:'travel',name:'Getting around',emoji:'🚕',sub:'Airports, stations, taxis and stops',phrases:travelPhrases}
]};
})();
