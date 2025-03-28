import React from 'react';
import SubModuleOption from './SubModuleButton';

const barStyles = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    border: "1px solid #a98467",
    borderRadius: "7px",
    backgroundColor: "#C4A389",//"#a98467"
}

function SubModuleBar (props) {
    /* 
    moduleData is passed via props
    It is a list of dictionaries with
    url and text as it's keys.
    */
    const moduleUrlNameDictList = props.moduleData;

    return (
        <div style={barStyles}>
            {moduleUrlNameDictList.map( (d)=>(
                <SubModuleOption url={d.url} text={d.text}/>
            ))}
        </div>
    );
};

export default SubModuleBar;