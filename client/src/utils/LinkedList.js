const sort = (list) =>{
    let arr = [];

    let index = list.findIndex(e => e.nextId === null);

    if(index > -1){

        let item = list[index];
        arr.push(item);
        list.splice(index,1);
        for(let i = 0,len = list.length;i<len;i++){
            index = list.findIndex(e =>  e.nextId === item._id);
            if(index < 0) break;
            arr.push(list[index]);
            item = list[index];
            list.splice(index,1);
        }
    }

    return arr.reverse().concat(list);
}

export default sort;