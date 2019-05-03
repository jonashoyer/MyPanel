const onSort = (oldIndex, newIndex,list,selected,cb) => {

    if(oldIndex === newIndex) return;

    let changes = [];
    
    if(oldIndex > 0){
        changes.push({
            _id: list[oldIndex - 1]._id,
            nextId: oldIndex + 1 < list.length ? list[ oldIndex + 1 ]._id : null
        });
    }

    let nxt = newIndex - (newIndex < oldIndex ? 1 : 0);
    if(nxt > -1 ){
        changes.push({
            _id:list[nxt]._id,
            nextId:list[oldIndex]._id
        });
    }

    let then = newIndex + (newIndex > oldIndex ? 1 : 0);
    changes.push({
        _id:list[oldIndex]._id,
        nextId: then < list.length ? list[then]._id : null
    });

    cb({api:{changes,id:selected},client:{oldIndex,newIndex,listId:selected}});
}

export default onSort;

