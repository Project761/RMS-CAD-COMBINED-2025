import React, { Component, useEffect, useState } from 'react';
// import TreeData from './sample.data.js';

const TreeComponent = () => {

    // var treeData = 

    const [TreeData, setTreeData] = useState({
        groupDropOptionId: 39,
        groupDropFieldId: 6,
        parentId: 1,
        name: 'Bangladesh',
        exportValue: 'BD',
        showChildren: true,
        editMode: false,
        children: [
            {
                groupDropOptionId: 54,
                groupDropFieldId: 6,
                parentId: 2,
                name: 'sylhet',
                exportValue: '3',
                showChildren: true,
                editMode: false,
                children: []
            }
        ]
    })

    const [editableNode, setEditableNode] = useState('')

    const addRoot = () => {
        // let root = {
        //     name: '',
        //     exportValue: '',
        //     showChildren: true,
        //     editMode: true,
        //     children: []
        // }
        // setTreeData({ root });
    }

    const handleEditChange = (e, value) => {
        value[e.target.name] = e.target.value;
        // setTreeData(value);
    }

    const deleteNode = (parent, index) => {
        parent.splice(index, 1);
        setTreeData(parent);
    }

    const makeEditable = (value) => {
        // editableNode = JSON.parse(JSON.stringify(value));
        // value.editMode = true;
        // setTreeData(value);
    }

    const closeForm = (value, parent, index) => {
        if (value.name !== '' && value?.exportValue !== '') {
            value.name = editableNode?.name;
            value.exportValue = editableNode?.exportValue;
            value.editMode = false;
            // setTreeData(value);
        }
        else {
     
            parent.splice(index, 1);
            // setTreeData(parent);
        }
    }

    const doneEdit = (value) => {
        value.editMode = false;
        setTreeData(value);
    }

    const toggleView = (ob) => {
        ob.showChildren = !ob.showChildren;
        // setTreeData(ob);
    }

    const addMember = (parent) => {
        // console.log(parent)
        let newChild = {
            name: '',
            exportValue: '',
            showChildren: false,
            editMode: true,
            children: []
        }
        parent.children.push(newChild);
        // console.log(parent);
        // console.log(TreeData);
        // setTreeData(parent);
        getNodes(parent)
    }

    const addChild = (node) => {
        // console.log(node)
        node.showChildren = true;
        node.children.push({
            name: '',
            exportValue: '',
            showChildren: false,
            editMode: true,
            children: []
        });
        // console.log(node)
        // setTreeData(node);
        // getNodes(node)
    }

    const nodeEditForm = (value, parent, index) => {
        // console.log("value", value)
        // console.log("parent", parent)
        // console.log("index", index)
        return (
            <div className="node node_edit" onClick={(e) => { e.stopPropagation() }}>
                <form className="node_edit_form">
                    <div className="field name">
                        <input value={value?.name}
                            type="text"
                            name='name'
                            placeholder='Option'
                            onChange={(e) => { handleEditChange(e, value) }}
                        />
                    </div>
                    <div className="field code">
                        <input value={value?.exportValue}
                            type="text"
                            name='exportValue'
                            placeholder='Value'
                            onChange={(e) => { handleEditChange(e, value) }}
                        />
                    </div>
                    <div className="field action_node">
                        <span className="fa fa-check" onClick={(e) => { doneEdit(value) }}></span>
                        <span className="fa fa-close" onClick={(e) => { closeForm(value, parent, index) }}></span>
                    </div>
                </form>
            </div>
        )
    }

    const makeChildren = (node) => {

        // console.log(!node || node?.length === 0)
        if (node?.children.length === 0) return null;

        let children;
        children = node?.children?.map((value, index) => {
 
            let item = null;
            // A node has children and want to show her children
            if (value?.children?.length > 0 && value?.showChildren) {
                // console.log("value?.children?.length > 0 && value?.showChildren")
                let babies = makeChildren(value.children);
                let normalMode = (
                    <div className="node">
                        <i className="fa fa-minus-square-o"></i>{value?.name}
                        <span className="actions">
                            <i className="fa fa-close" onClick={(e) => { e.stopPropagation(); deleteNode(node, index) }}></i>
                            <i className="fa fa-pencil" onClick={(e) => { e.stopPropagation(); makeEditable(value) }}></i>
                        </span>
                    </div>
                )
                item = (
                    <li key={index} onClick={(e) => { e.stopPropagation(); toggleView(value) }}>
                        {(value?.editMode) ? nodeEditForm(value, node, index) : normalMode}
                        {babies}
                    </li>
                )
            }

            // A node has children but don't want to showing her children
            else if (value?.children?.length > 0 && !value?.showChildren) {
                // console.log('value?.children?.length > 0 && !value?.showChildren')
                item = (
                    <li key={index} onClick={(e) => { e.stopPropagation(); toggleView(value) }}>
                        <div className="node"><i className="fa fa-plus-square-o"></i>{value?.name}</div>
                    </li>
                );
            }

            // A node has no children
            else if (value.children.length === 0) {
         
                let normalMode = (
                    <div className="node"><i className="fa fa-square-o"></i>{value.name}
                        <span className="actions">
                            <i className="fa fa-plus" onClick={(e) => { e.stopPropagation(); addChild(value) }}> </i>
                            <i className="fa fa-pencil" onClick={(e) => { e.stopPropagation(); makeEditable(value) }}></i>
                            <i className="fa fa-close" onClick={(e) => { e.stopPropagation(); deleteNode(node, index) }}></i>
                        </span>
                    </div>
                );
                item = (
                    <li key={index} onClick={(e) => e.stopPropagation()}>
                        {/* {(value.editMode) ? nodeEditForm(value, node, index) : normalMode} */}
                        {/* {nodeEditForm(value, node, index)} */}
                        {normalMode}
                    </li>
                );
            }

            return item;
        });

        return (
            <ul >
                {children}
                <li>
                    <div className="node add_node" onClick={(e) => { e.stopPropagation(); addMember(node) }}>
                        <i className="fa fa-square" ></i>
                        <a >Add New</a>
                    </div>
                </li>
            </ul>
        );
    }

    const getNodes = (node) => {
   
        let children = node ? makeChildren(node) : makeChildren(TreeData);
        let root = (
            <span className="root">{TreeData.name}
                <span className="actions"> &nbsp;  &nbsp;
                    <i className="fa fa-pencil" onClick={(e) => { makeEditable(TreeData);  }}> edit </i>
                    <i className="fa fa-plus" onClick={(e) => { addChild(TreeData);  }}> Add_child </i>
                </span>
            </span>
        )
        return (
            <div className="tree">
                {TreeData.editMode ? nodeEditForm(TreeData) : root}
                {children}
            </div>
        );
    }

    return (
        <div className="row">
            <div className="col-md-offset-4 col-md-3">
                <div className="group_dropdown_content">
                    {getNodes(TreeData)}
                </div>
            </div>
        </div>
    );
}

export default TreeComponent



//------------- Showing children ----------
/*
<ul>
    <li>
        <div className="node">
            <i className="fa fa-minus-square-o"></i>Dhaka (DHK)
            <span className="actions"><i className="fa fa-close"></i><i className="fa fa-pencil"></i> </span>
        </div>
        <ul>
            <li><div className="node"><i className="fa fa-square-o"></i>Satgram (SAT)<span className="actions"><i className="fa fa-close"></i><i className="fa fa-pencil"></i> </span></div></li>
            <li><div className="node"><i className="fa fa-square-o"></i>Satgram (SAT)<span className="actions"><i className="fa fa-close"></i><i className="fa fa-pencil"></i> </span></div></li>
            <li><div className="node add_node"><i className="fa fa-square"></i><a href="">Add New</a> </div></li>
        </ul>
    </li>
</ul>
*/

//------------- Don't show children -------
/*
<ul>
    <li><div className="node"><i className="fa fa-plus-square-o"></i>Mymenshingh (MYM)</div></li>
    <li><div className="node"><i className="fa fa-plus-square-o"></i>Rangpur (RAN)</div></li>
</ul>
*/


// ---------------- Editing mode -----------
/*
<div className="node node_edit">
    <form className="node_edit_form">
        <div className="field name"><input value="Gopalganj" type="text" /> </div>
        <div className="field code"><input value="GOP" type="text" /> </div>
        <div className="field action_node">
            <span className="fa fa-check"></span>
            <span className="fa fa-close"></span>
        </div>
    </form>
</div>
*/

