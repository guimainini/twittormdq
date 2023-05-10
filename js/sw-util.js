
//Guardar en el cache Dinamico
function actualizaCacheDinamico( dynamicCachem, req, res ){
    if ( res.ok ) {
        return caches.open( dynamicCachem ).then( cache => {
            cache.put( req, res.clone() );
            return res.clone();
        });
    }else{
        return res;
    }
}


