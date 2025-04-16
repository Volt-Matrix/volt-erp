import React from 'react';
import SubModuleOption from './SubModuleButton';

const barStyles = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginRight:"10px",
    border: "1px solid #b5c99a",
    borderRadius: "7px",
    backgroundColor: "#cfe1b9",//"#a98467"
    flexWrap:"wrap"
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