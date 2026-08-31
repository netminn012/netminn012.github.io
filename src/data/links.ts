export type IconName = 'discord'|'github'|'x'|'youtube'|'hatena'|'scratch'|'note'|'qiita'|'site';
export interface LinkItem { name:string; description:string; url:string; icon:IconName; featured?:boolean }
export interface SiteItem extends LinkItem { external:boolean; displayUrl:string }
export const mainLinks:LinkItem[] = [
 {name:'Discord Server',description:"netminn012's server",url:'https://discord.gg/grHTbCQTVr',icon:'discord',featured:true},
 {name:'GitHub',description:'@netminn012',url:'https://github.com/netminn012',icon:'github'},
 {name:'X / Twitter',description:'@netminn012',url:'https://twitter.com/netminn012',icon:'x'},
 {name:'YouTube',description:'@netminn012',url:'https://www.youtube.com/@netminn012',icon:'youtube'},
 {name:'はてなブログ',description:'Android・PC・鉄道など',url:'https://netminn012.hatenablog.com/',icon:'hatena'}
];
export const otherLinks:LinkItem[] = [
 {name:'Discord メイン',description:'@netminn012',url:'https://discord.com/users/1133996291349827584',icon:'discord'},
 {name:'Discord サブ',description:'サブアカウント',url:'https://discord.com/users/1184079519896838234',icon:'discord'},
 {name:'Scratch メイン',description:'netminn012',url:'https://scratch.mit.edu/users/netminn012/',icon:'scratch'},
 {name:'Scratch サブ',description:'subminn012',url:'https://scratch.mit.edu/users/subminn012/',icon:'scratch'},
 {name:'note',description:'netminn012',url:'https://note.com/netminn012',icon:'note'},
 {name:'Qiita',description:'@netminn012',url:'https://qiita.com/netminn012',icon:'qiita'}
];
export const operatedSites:SiteItem[] = [
 {name:'田所浩二.jp',description:'ネタ系サイト / 個人運営',displayUrl:'田所浩二.jp',url:'https://xn--4kq239b58hryh.jp/',icon:'site',external:true},
 {name:'netminn012.com',description:'このリンク集サイト',displayUrl:'netminn012.com',url:'/',icon:'site',external:false}
];
