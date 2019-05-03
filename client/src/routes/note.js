import React, { Component } from 'react';
import {connect} from "react-redux";
import ReactDOM from 'react-dom';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';

import IconButton from '@material-ui/core/IconButton';

import Button from '@material-ui/core/Button';

import Icon from "@material-ui/core/Icon";
import GridLayout from 'react-grid-layout';
// import ContentAdd from '@material-ui/core/svg-icons/content/add';
// import MoreVertIcon from '@material-ui/core/svg-icons/navigation/more-vert';

import DialogView from "../Components/dialog";
import {fetch,createNote, setNote, orderNote,updateNotes} from "../actions/note";
// import { Manager, Reference, Popper } from 'react-popper';
import Popover from '@material-ui/core/Popover';
import Fade from '@material-ui/core/Fade';

import LinkPopover from "../Components/LinkPopover";
import {EmptyContent, EncryptedContent} from "../Components/projectStateContent";

const btnAbs= {
    position: 'fixed',
    right: 24,
    bottom: 16,
    zIndex: 1000
}

const _cols = {lg: 4, md: 3, sm: 2, xs: 1};
const breakpoints = {lg: 1400, md: 1150, sm: 700, xs: 0};


const buttonStyle={
    marginLeft: 5,
    marginRight: 5,
};

class Note extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 1,
            dialog: "",
            dialogValue: "",
            noteChanges: {},
            loading: false,
            editMode: false,
            allChanges: {},
            width: window.innerWidth,
            noteText:{},
            layout:{}

        };

        this.setPopperTarget = this.setPopperTarget.bind(this);
        this.urlPopperClose = this.urlPopperClose.bind(this);

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.saveNotes = this.saveNotes.bind(this);
    }

    setLoadState = (b) => {
        if(b === this.state.loading) return;
        this.setState({loading:b})
    }

    setPopperTarget(t){
        const { currentTarget } = t.event;
        this.setState({
            anchorEl: currentTarget,
            url:t.url
        });
    }

    urlPopperClose(){
        this.setState({anchorEl:undefined});
    }

    saveNotes = () =>{
        
        const changes = this.state.noteChanges;
        
        for (let key in changes) {
            if (!changes.hasOwnProperty(key)) continue;
            
            setNote(this.props.selected, key, changes[key]);
        }

        this.setState({noteChanges: {}});
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        window.addEventListener("beforeunload", this.saveNotes);
    }
    
    componentWillUnmount(){
        this.saveNotes();
        const {selected} = this.props;
        const {allChanges} = this.state;
        this.props.updateNotes(selected,allChanges);
        window.removeEventListener('resize', this.updateWindowDimensions);
        window.removeEventListener("beforeunload", this.saveNotes)
    }

    updateWindowDimensions() {
        console.log("New Width",window.innerWidth);
        this.setState({ width: window.innerWidth });
    }

    setDialog = (v = "", value = "") => {
        this.setState({dialog: v, dialogValue: value});
    }

    noteChange = (id, value) =>{

        let {noteChanges,allChanges,noteText} = this.state;
        

        noteChanges[id] = value;
        allChanges[id] = value;

        this.setState({
            noteChanges,
            noteText: {
                ...noteText,
                [id]:value
            }
        })

        if(this.timeout){
            clearTimeout(this.timeout);
        }
        
        this.timeout = setTimeout(this.saveNotes,2000);
    }

    AddNewNote = () => {
        this.props.createNote(this.props.selected);
    }

    OpenEncryptionUnlock = () => {
        const {selected,list} = this.props;
    
        const _list = list.find(e => e._id === selected);
      
        if(_list && _list.encryption && _list.encryption.cipher){
          this.setDialog("UNLOCK_KEY",{..._list.encryption,listId:selected});
        }
      }

    render() {

        const {selected,list,listNote,fetch} = this.props;
        const {currSelected,anchorEl,url,layout,width,editMode,loading,noteText} = this.state;

        if(list.length){

            const _list = list.find(e => e._id === selected);
            var hasEncryption = _list && (_list.encryptionStatus == "encrypting" || _list.encryptionStatus == "encrypted");
            var hasPhrase = _list && _list.encryption && !!_list.encryption.phrase;
        
            console.log(hasEncryption,hasPhrase);
            
            if( currSelected !== selected){
        
                if(_list && hasEncryption && !hasPhrase){
                    this.setDialog("UNLOCK_KEY",{..._list.encryption,listId:selected});
                }
        
                this.setState({
                    currSelected: selected,
                })
            }
        }

        const index = listNote.findIndex((e)=>{return e.id === selected});

        if(index > -1){

            if(loading) this.setLoadState(false);
        
            var arr = listNote[index].data;
            
            var _width = width*.98 + (width > 1250 ? -250 : 0);
            var cols = getCols(_width,breakpoints,_cols);
        }else{
            if(!loading){
                this.props.fetch(selected);
                this.setLoadState(true);
            }
        }

        const LayoutChange = (newLayout,oldLayout,currCols) =>{
            for(let i = 0,len = oldLayout.length;i<len;i++){
                const oldItem = oldLayout[i], newItem = newLayout[i];
                if(!oldItem || !newItem) continue;
                if(oldItem.x !== newItem.x || oldItem.y !== newItem.y){
                    //Update Item
                    const i = newItem.y * currCols + newItem.x;
                    orderNote({id:selected,noteId:oldItem.i,i});
                }
            }
        }

        const calcH = (id,px) => {
            this.setState({
                layout: this.state.layout.map(x =>{

                    if(x.i !== id) return x;

                    return {
                        ...x,
                        h: Math.ceil(px / 160)
                    }
                })
            })
        }

        const drawLayout = (arr)=>{

            const layout =  arr.map((e,i)=> {
                    
                i = e.pos !== undefined ? e.pos : i;

                return{
                    x: (i % cols),
                    y: Math.floor(i / cols),
                    w: 1,
                    h: 1,
                    i: e._id
                }
            });
            this.setState({layout,cols,layoutId:selected});
        }
        
        if(arr && (this.state.layoutId !== selected || this.state.cols !== cols)){

            drawLayout(arr);
            return null;
        }

        const isUnlocked = (hasPhrase || !hasEncryption);

        return (
            <div>
                <DialogView setDialog={this.setDialog} dialog={this.state.dialog} dialogValue={this.state.dialogValue} />
                {!loading &&
                    <div style={btnAbs}>
                        {!editMode && <Tooltip title="Add note">
                            <Button color="primary" variant="fab" style={buttonStyle} disabled={!isUnlocked} onClick={this.AddNewNote}>
                                <Icon>add</Icon>
                            </Button>
                        </Tooltip>}
                        <Tooltip title="Edit mode">
                            <Button color="secondary" variant="fab"  className="list-action-button" style={buttonStyle} disabled={!isUnlocked} onClick={()=>{this.setState({editMode: !editMode})}}>
                                <Icon>{editMode ? "done" : "edit"}</Icon>
                            </Button>
                        </Tooltip>
                    </div>}
                <div className="sticky-note-content">

                    {loading && (<div className="load-spinner" />)}
                    
                    {/* <FetchData {...this.props} { ...this.state} setPopperTarget={this.setPopperTarget} AddNewNote={this.AddNewNote} onChange={this.noteChange} setDialog={this.setDialog} setLoadState={this.setLoadState} /> */}

                    {!loading && !isUnlocked && <div className="sticky-note-center-message"> <EncryptedContent onClick={this.OpenEncryptionUnlock}/> </div>}

                    {!loading && isUnlocked && arr && <div>
                        <GridLayout cols={cols} width={_width} isDraggable={editMode} isResizable={false} layout={layout} onDragStop={(lay)=>{LayoutChange(lay,layout,cols); this.setState({layout:lay})}}>  
                            {arr.map((e,i) => {
                                    let txt = noteText[e._id] || e.note;

                                return <Paper key={e._id} className="note">
                                    {editMode && <div className="note-moveable"><Icon>open_with</Icon></div>}
                                    <ContentEditable setTarget={this.setPopperTarget} className="text-area" onChange={(v)=>this.noteChange(e._id,v)} onHeightChange={(px) => calcH(e._id,px)} html={txt}/>
                                    {editMode && <IconButton className="trash-icon" onClick={()=> this.setDialog("NOTE_DELETE",{id:e.listId,noteId:e._id})}>
                                        <Icon>delete</Icon>
                                    </IconButton>}
                                </Paper>
                            })}
                        </GridLayout>

                        <LinkPopover onClose={this.urlPopperClose} anchorEl={anchorEl} url={url} />

                    </div>}   
    
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state)=>{
    return {
      selected: state.list.index,
      list: state.list.lists,
      listNote: state.note
    }
  }

export default connect(mapStateToProps,{fetch,createNote,orderNote,updateNotes})(Note);

const urlRegexp = /(https?:\/\/[^\s]+)/g;

class ContentEditable extends Component{
    
    state={}

    shouldComponentUpdate = (nextProps) => {
        // console.log(nextProps.html)
        return nextProps.html !== ReactDOM.findDOMNode(this).innerText;
    }
    
    componentDidMount(){
        setTimeout(this.checkHeightChange,50);
    }

    checkHeightChange = () => {
        const node = ReactDOM.findDOMNode(this);
        const height = this.props.onHeightChange( node.clientHeight );
        const {lastHeight} = this.state;

        if(lastHeight !== height){
            this.props.onHeightChange( height );
        }
    }

    emitChange = () => {

        const node = ReactDOM.findDOMNode(this);

        let txt = node.innerText;
        if (this.props.onChange && txt !== this.lastHtml) {
            this.props.onChange( txt );
            this.lastHtml = txt;
            this.checkHeightChange();
        }
    }

    render(){

        const {className, html} = this.props;

        let jsx = [];
        ///(\r\n|\n|\r)/gm
        if(html){

            const lines = html.split('\n');
            // lines.pop();
            const lineCount = lines.length - 1;
            lines.map((e,i)=>{
    
                const txts = e.split(urlRegexp);
                if(txts.length > 1){
                    
                    for(let _i = 0,len = txts.length;_i<len;_i++){
                        const txt = txts[_i];
                        (txt.search(urlRegexp) > -1) ?
                        jsx.push(<a href={txt} onClick={(e)=>{this.props.setTarget({event:e,url:txt})}}>{txt}</a>)
                        :
                        jsx.push(txt);
                    }
                }else{
                    jsx.push(e);
                }
    
                i !== lineCount && jsx.push(<br />);
            })
        }

        // jsx.push(html);

        // html = html.replace(/(https?:\/\/[^\s]+)/g,(url)=>{
        //     return '<a target="_blank" href="'+url+'">'+url+"</a>"
        // })
        
        return (
            <div 
                className={className}
                onInput={this.emitChange} 
                onBlur={this.emitChange}
                contentEditable
                >
                {jsx}
            </div>
        );
    }
};

const getCols = (width,breakpoints,cols) => {
    if (width < breakpoints.sm)
        return cols.xs;
    if(width < breakpoints.md)
        return cols.sm;
    if (width < breakpoints.lg)
        return cols.md;
    if (width >= breakpoints.lg)
        return cols.lg;
    return cols.xs;
}
  

// const SortableItem = SortableElement(({child}) => {
//     return child;
// });

// const SortableList = SortableContainer(({children,masonry}) =>
//     <GridLayout cols={4} isResizable={false}>
//          {/* ref={(c)=> {masonry = c}} */}
//         {children.map((value, index) => (
//             <SortableItem key={index} index={index} child={value} />
//         ))}
//     </GridLayout>
// );


// class SortableComponent extends Component {
//     render() {
//         return <SortableList masonry={this.props.masonry} lockToContainerEdges useDragHandle axis="y" helperClass="sort-item" children={this.props.children} onSortEnd={this.props.onSort} />;
//     }
// }