import React, { Component } from 'react';
import {AddListContent,RenameListContent,DeleteListContent, AddTodoContent, RenameTodoContent, DeleteTodoContent, EditTodoContent, AddPassContent,ShowPassContent,EditPassContent, DeletePassContent, StartTimeContent, RenameTimeContent, DeleteTimeContent, CreateTimeContent,
    CreateTimeSpanContent, EditTimeSpanContent, RemoveTimeSpanContent, RemoveNoteContent, CreateTagContent, AddUserContent,UsersAddedContent, RemoveUserContent,CreateKeyPassContent, UnlockKeyPassContent, RemoveKeyPassContent, ConfirmeKeyContent

} from "../Components/dialogContent";



const dialog = ({dialog, dialogValue,setDialog}) => {

    const props = {onClose:setDialog,value:dialogValue};

    switch(dialog){
        case "LIST_ADD":
            return <AddListContent onClose={setDialog} />
        case "LIST_RENAME":
            return <RenameListContent {...props} />
        case "LIST_DELETE":
            return <DeleteListContent onClose={setDialog} id={dialogValue} />
        case "TODO_ADD":
            return <AddTodoContent onClose={setDialog} id={dialogValue}/>
        case "TODO_RENAME":
            return <RenameTodoContent {...props}/>
        case "TODO_DELETE":
            return <DeleteTodoContent {...props}/>
        case "TODO_OPEN_NOTE":
            return <EditTodoContent {...props} />
        case "PASS_ADD":
            return <AddPassContent {...props} />
        case "PASS_SHOW":
            return <ShowPassContent {...props} />
        case "PASS_EDIT":
            console.log(props.value)
            return <EditPassContent {...props}/>
        case "PASS_DELETE":
            return <DeletePassContent {...props}/>

        case "CREATE_KEY":
            return <CreateKeyPassContent {...props} />
        case "COFIRME_KEY":
            return <ConfirmeKeyContent {...props} />
        case "REMOVE_KEY":
            return <RemoveKeyPassContent {...props} />

        case "UNLOCK_KEY":
            return <UnlockKeyPassContent {...props} />

        case "TIME_START":
            return <StartTimeContent {...props} />
        case "TIME_RENAME":
            return <RenameTimeContent {...props} />
        case "TIME_DELETE":
            return <DeleteTimeContent {...props} />
        case "TIME_CREATE":
            return <CreateTimeContent {...props} />
        case "TIME_SPAN_CREATE":
            return <CreateTimeSpanContent {...props} />
        case "TIME_SPAN_EDIT":
            return <EditTimeSpanContent {...props} />
        case "TIME_SPAN_REMOVE":
            return <RemoveTimeSpanContent {...props} />
        case "NOTE_DELETE":
            return <RemoveNoteContent {...props} />
        case "TAG_CREATE":
            return <CreateTagContent {...props} /> 
        case "ADD_USER":
            return <AddUserContent {...props} />
        case "USERS_ADDED":
            return <UsersAddedContent {...props} />
        case "REMOVE_USER":
            return <RemoveUserContent {...props} />
        default:
            return null;
    }
}

export default dialog;