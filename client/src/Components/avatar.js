import React, { Component } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import ColorGen from "../utils/ColorGenerate";
export default ({id,name,style,avatarStyle,children,avatarChildren,onClick,useTooltip,small}) =>{

    const words = name.split(" ");
    let short = "";
    for (let i = 0, len = words.length; i < len; i++)short += words[i].charAt(0);
    
    let col = ColorGen(id);

    if (short.length > 3) {
        short = short.substring(0, 2) + short.slice(-1);
    }
    
    const _avatarStyke = {
        ...avatarStyle,
        background:col,
        margin:"auto",
        fontSize: short.length > 2 ?
            (small ? ".7rem" : "1rem")
        : 
            (small ? "1rem" : "1.25rem"),
        height: small ? 30 : 40,
        width: small ? 30 : 40
    }

    return <div style={style}>
        <Wrap title={useTooltip && name}>
            <div>
                <Avatar onClick={onClick} className="userAvatar" style={_avatarStyke}>
                    {avatarChildren}
                    <div style={{color:"#fff"}}>
                        {short.toUpperCase()}
                    </div>
                </Avatar>
                {children}
            </div>
        </Wrap>
    </div>
}

const Wrap = ({children,title}) => title ? <Tooltip title={title}>{children}</Tooltip> : children;
