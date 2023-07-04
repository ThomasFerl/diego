export var debug    = false;
export var Screen   = undefined;
export var webApp   = {};
export var em2px    = 16;

//const Server           = 'homeserver:8080';
export const Server           = 'xHost:8080';
//export const fileRoot         = '/home/tferl/extVideos/'
export const fileRoot         =   '/' //'/mnt/plex/NewFolder/'

export const URL_all_Actors   =  'http://'+Server+'/actors';
export const URL_Img_Actor    =  'http://'+Server+'/ActorImg?ID=';
export const URL_Info_Actor   =  'http://'+Server+'/ActorInfo?ID=';
export const URL_Clips_Actor  =  'http://'+Server+'/movies?ActorID=';

export const URL_Clip_Capture =  'http://'+Server+'/movieCapture?ID=';
export const URL_Clip_Thumbs  =  'http://'+Server+'/movieThumbs?ID=';
export const URL_Clip_Details =  'http://'+Server+'/movieDetails?ID=';
export const URL_Clip_Play    =  'http://'+Server+'/playMovie?ID=';
export const URL_scanDir      =  'http://'+Server+'/scanDir?dirName=';
export const URL_loadImg      =  'http://'+Server+'/loadImg?img=';
export const URL_loadMovie    =  'http://'+Server+'/loadMovie?Movie=';
export const URL_registerMovie=  'http://'+Server+'/registerMovie?Movie=';
export const URL_isRegistered =  'http://'+Server+'/isRegistered?Movie=';
export const URL_webAppRequest=  'http://'+Server+'/X?X=';


export const URL_static       =  'http://'+Server+'/';


export const movieMime = ['MP4','FLV','MPG','MPEG','MP2T','WMV','AVI','TS','M3U8','MOV','M4V','WEBM','WEBA','OGM','OGV','OGG'];

export const imageMime = ['GIF','JPG','JPEG','PNG','SVH','BMP'];





export function setScreen( s ) { Screen = s}

export function initWebApp( w ) { webApp = w}
