import { memo, useContext, useEffect, useState } from 'react';
import React, { Component } from 'react';
// import TreeData from './sample.data'; 
import axios from 'axios';
import { AddDeleteUpadate, fetchPostData, fetchTreeModelPostData } from '../../hooks/Api';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Decrypt_Id_Name } from '../../Common/Utility';
import { toastifyError, toastifySuccess } from '../../Common/AlertMsg';
import { AgencyContext } from '../../../Context/Agency/Index';
// import TreeData from './sample.data.js';

const TreeModalPL = (props) => {

    const { proRoom, locationStatus, functiondone, storagetype, setlocationStatus, value, searchStoStatus, setSearchStoStatus, setValue, setPropertyNumber, keyChange } = props

    const dispatch = useDispatch()
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const [TreeData, setTreeData] = useState()
    const [selectBranch, setSelectBranch] = useState();
    const [isEditLocation, setIsEditLocation] = useState()

    useEffect(() => {
        if (proRoom == 'PropertyRoom') { setIsEditLocation(false) } else { setIsEditLocation(true) }
    }, [proRoom]);

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (functiondone == 'true' || functiondone == true) {
            setSelectBranch('');
        }

    }, [functiondone])

    useEffect(() => {
        if (localStoreData) {
            if (localStoreData?.AgencyID) { getTreeData(localStoreData?.AgencyID) }
        }
    }, [localStoreData]);

    const getTreeData = async (ID) => {
        const pormise = fetchTreeModelPostData('PropertyStorageLocation/GetData_PropertyStorageLocation', { AgencyID: ID }).then(response => {

            if (response?.length > 0) {

                setTreeData(response[0])
            } else {
                console.log(response)
            }
        })

        // try {
        //     const res = await axios.post('PropertyStorageLocation/GetData_PropertyStorageLocation', { AgencyID: ID })

        //     if (res?.data?.success) {
        //         const parceData = JSON.parse(res?.data?.data)
        //         setTreeData(parceData[0])
        //     }
        // } catch (error) {
        //     console.log(error)
        // }
    }

    const addChild = (obj) => {
        const { name, parentId, exportValue, editMode, showChildren, children } = obj
        const val = { name: name, parentId: parentId, exportValue: exportValue, NodePath: '', CreatedByUserFK: localStoreData?.PINID, AgencyID: parseInt(localStoreData?.AgencyID) }
        fetchPostData('PropertyStorageLocation/Insert_PropertyStorageLocation', val).then((res) => {

            getTreeData(localStoreData?.AgencyID)
        })
    }

    const delChild = (obj) => {
        const { name, parentId, exportValue, Id, editMode, showChildren, children } = obj
        const val = { Id: Id, DeletedByUserFK: localStoreData?.PINID, IsActive: false }
        AddDeleteUpadate('PropertyStorageLocation/Delete_PropertyStorageLocation', val).then((res) => {
            const parseRes = JSON.parse(res?.data)
            toastifySuccess(parseRes?.Table[0]?.Message);
            getTreeData(localStoreData?.AgencyID)

        })
    }

    const updateChild = (obj) => {
        const { name, parentId, exportValue, Id, editMode, showChildren, children } = obj
        const val = { name: name, parentId: parentId, exportValue: exportValue, Id: Id, NodePath: '', CreatedByUserFK: localStoreData?.PINID, AgencyID: parseInt(localStoreData?.AgencyID) }
        AddDeleteUpadate('PropertyStorageLocation/Update_PropertyStorageLocation', val).then((res) => {
            const parseRes = JSON.parse(res?.data)
            toastifySuccess(parseRes?.Table[0]?.Message);
            getTreeData(localStoreData?.AgencyID)
        })
    }

    const handleSelect = (selectBranch) => {
        const val = { Id: selectBranch };
        if (selectBranch) {
            fetchPostData("PropertyStorageLocation/GetPathData_PropertyStorageLocation", val).then((data) => {
                if (data) {
                    if (storagetype === 'NewStorageLocation') {
                        setValue(prev => ({
                            ...prev,
                            DestinationStorageLocation: data[0].NodePath,
                            StorageLocationID: data[0].StorageLocationID
                        }));
                        setlocationStatus(false);
                    }
                    else {
                        setValue(prev => ({
                            ...prev,
                            location: data[0].NodePath,
                            StorageLocationID: data[0].StorageLocationID
                        }));
                        
                    }

                } else {
                    setValue(prev => ({
                        ...prev,
                        location: data[0].NodePath,
                        StorageLocationID: data[0].StorageLocationID
                    }));
                    setlocationStatus(false);
                }
            });
        }
        else {
            toastifyError('Please select Path')
        }
        // Implement logic based on the selected branch.
    };



    const handleSelectSearch = (selectBranch) => {
        const val = { Id: selectBranch };
        fetchPostData("PropertyStorageLocation/GetPathData_PropertyStorageLocation", val).then((data) => {
            if (data) {
                setPropertyNumber(data[0].StorageLocationID);
                setSearchStoStatus(false);
            } else {
                setSearchStoStatus(false);
            }
        });

    };

    const closeModalLogic = () => {
        if (value.location && locationStatus) {
            handleSelect(selectBranch);
        } else if (value.location && searchStoStatus) {
            handleSelectSearch(selectBranch);
        }
    };

    useEffect(() => {
        const handleKeydown = (event) => {
            if (event.key === "Escape") {
                closeModalLogic();
            }
        };
        window.addEventListener("keydown", handleKeydown);
        return () => {
            window.removeEventListener("keydown", handleKeydown);
        };
    }, [value, locationStatus, searchStoStatus, selectBranch]);


    return (
        TreeData &&
        <div className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="PropertyRoomTreeModal" tabIndex="-1" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
            <div className="modal-dialog modal-lg modal-dialog-centered rounded modal-dialog-scrollable">
                <div className="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title model-color">Property Room Storage Location</h5>
                        <button type="button" className="border-0" aria-label="Close" data-dismiss="modal" onClick={() => {
                            setTreeData([]); if (value.location && locationStatus) {
                                handleSelect(selectBranch);
                            } else if (value.location && searchStoStatus) {
                                handleSelectSearch(selectBranch);
                            }
                        }} style={{ alignSelf: "end" }}><b>X</b>
                        </button>
                    </div>
                    <div className="modal-body p-2">
                        <div className="">
                            <div className="row ">
                                <div className="col-12 col-md-12 col-lg-12 ">
                                    <Treeview isEditLocation={isEditLocation} selectBranch={selectBranch} setSelectBranch={setSelectBranch} TreeData={TreeData} addChild={addChild} delChild={delChild} updateChild={updateChild} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-md btn-success" data-toggle="modal" data-target="#PropertyRoomTreeModal" onClick={() => {
                            if (locationStatus) {
                                handleSelect(selectBranch);
                            } else if (searchStoStatus) {
                                handleSelectSearch(selectBranch);
                            }
                        }}  >Okay</button>
                        <button type="button" data-dismiss="modal" onClick={() => {
                            if (value.location && locationStatus) {
                                handleSelect(selectBranch);
                            } else if (value.location && searchStoStatus) {
                                handleSelectSearch(selectBranch);
                            }
                        }} class="btn btn-md btn-primary">Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(TreeModalPL)



class Treeview extends Component {

    constructor(props) {

        super(props);
        this.state = {
            // data: TreeData,
            data: props?.TreeData,
            editableNode: '',
            addChild: props?.addChild,
            updateChild: props?.updateChild,
            delChild: props?.delChild,
            selectBranch: props?.selectBranch,
            setSelectBranch: props?.setSelectBranch,
            isEditLocation: props?.isEditLocation

        }
    }

    // async componentDidMount() {
    //     try {
    //         const res = await axios.post('PropertyStorageLocation/GetData_PropertyStorageLocation', { 'AgencyID': '19' })
    //         // console.log(res)
    //         // this.setState({ data: booksList });
    //     } catch (error) {
    //         // console.log(error)
    //         // this.setState({ data: booksList });
    //     }
    // }

    addRoot = () => {
        let root = {
            name: '',
            exportValue: '',
            showChildren: true,
            editMode: true,
            children: []
        }
        this.setState({
            data: root
        });
    }

    handleEditChange = (e, value) => {
        value[e.target.name] = e.target.value;
        this.setState({ value });
    }

    deleteNode = (parent, index, value) => {

        parent.splice(index, 1);
        this.setState({ parent });
        // Del node with api
        this.state.delChild(value)
    }

    makeEditable = (value) => {
        this.state.editableNode = JSON.parse(JSON.stringify(value));
        value.editMode = true;
        this.setState({ value });
    }

    closeForm = (value, parent, index) => {
        if (value.name !== '' && value.exportValue !== '') {
            value.name = this.state.editableNode.name;
            value.exportValue = this.state.editableNode.exportValue;
            value.editMode = false;
            this.setState({ value });
        }
        else {

            parent.splice(index, 1);
            this.setState({ parent });
        }
    }

    doneEdit = (value, parent, index) => {

        value.editMode = false;
        this.setState({ value });
        // add node in data base
        if (value?.Id) { this.state.updateChild(value) } else { this.state.addChild(value) }
        // this.state.addChild(value)
    }

    toggleView = (ob) => {
        ob.showChildren = !ob.showChildren;
        this.setState({ ob });
    }

    addMember = (parent) => {

        let newChild = {
            parentId: parent[0]?.parentId,
            name: '',
            exportValue: '',
            showChildren: false,
            editMode: true,
            children: []
        }
        parent.push(newChild);
        this.setState({ parent });
    }

    addChild = (node) => {
        node.showChildren = true;
        node.children.push({
            parentId: node?.Id,
            name: '',
            exportValue: '',
            showChildren: false,
            editMode: true,
            children: []
        });
        this.setState({ node });
    }

    nodeEditForm = (value, parent, index) => {

        return (
            <div className="node node_edit" onClick={(e) => { e.stopPropagation() }}>
                <form className="node_edit_form">
                    <div className="field name">
                        <input value={value.name}
                            type="text"
                            name='name'
                            placeholder='Option'
                            onChange={(e) => { this.handleEditChange(e, value) }}
                        />
                    </div>
                    <div className="field code">
                        <input value={value.exportValue}
                            type="text"
                            name='exportValue'
                            placeholder='Value'
                            onChange={(e) => { this.handleEditChange(e, value) }}
                        />
                    </div>
                    <div className="field action_node">
                        <span className="fa fa-check" onClick={(e) => { this.doneEdit(value, parent, index) }}></span>
                        <span className="fa fa-close" onClick={(e) => { this.closeForm(value, parent, index) }}></span>
                    </div>
                </form>
            </div>
        )
    }

    makeChildren = (node) => {
        if (typeof node === 'undefined' || node.length === 0) return null;

        let children;
        children = node.map((value, index) => {

            let item = null;

            // A node has children and want to show her children
            if (value.children?.length > 0 && value.showChildren) {
                let babies = this.makeChildren(value.children);
                let normalMode = (
                    <div className="node" style={{ backgroundColor: value.Id == this.props?.selectBranch ? 'pink' : '' }} onClick={(e) => { this.props.setSelectBranch(value?.Id); }}>
                        <i className="fa fa-minus-square-o" ></i>{value.name}
                        <span className="actions">
                            {
                                this.props.isEditLocation && <>
                                    <i className="fa fa-close" onClick={(e) => { e.stopPropagation(); this.deleteNode(node, index, value) }}></i>
                                    <i className="fa fa-pencil" onClick={(e) => { e.stopPropagation(); this.makeEditable(value) }}></i>
                                </>
                            }
                        </span>
                    </div>
                )
                item = (
                    <li key={index} onClick={(e) => { e.stopPropagation(); this.toggleView(value); }}>
                        {(value.editMode) ? this.nodeEditForm(value, node, index) : normalMode}
                        {babies}
                    </li>
                )
            }

            // A node has children but don't want to showing her children
            else if (value.children?.length > 0 && !value.showChildren) {
                item = (
                    <li key={index} style={{ backgroundColor: value.Id == this.props?.selectBranch ? 'pink' : '' }} onClick={(e) => { e.stopPropagation(); this.toggleView(value); this.props.setSelectBranch(value?.Id); }}>
                        <div className="node" ><i className="fa fa-plus-square-o"></i>{value.name}</div>
                    </li>
                );
            }

            // A node has no children
            else if (value.children?.length === 0) {
                // console.log(value?.Id)
                let normalMode = (
                    <div className="node" style={{ backgroundColor: value.Id == this.props?.selectBranch ? 'pink' : '' }} onClick={(e) => { this.props.setSelectBranch(value?.Id); }}>
                        <i className="fa fa-square-o"></i>{value.name}
                        <span className="actions">
                            {
                                this.props.isEditLocation &&
                                <>
                                    <i className="fa fa-plus" onClick={(e) => { e.stopPropagation(); this.addChild(value) }}> </i>
                                    <i className="fa fa-pencil" onClick={(e) => { e.stopPropagation(); this.makeEditable(value) }}></i>
                                    <i className="fa fa-close" onClick={(e) => { e.stopPropagation(); this.deleteNode(node, index, value) }}></i>
                                </>
                            }
                        </span>
                    </div>
                );
                item = (
                    <li key={index} onClick={(e) => { e.stopPropagation(); }}>
                        {(value.editMode) ? this.nodeEditForm(value, node, index) : normalMode}
                    </li>
                );
            }
            return item;
        });

        return (
            <ul >
                {children}
                <li>
                    <div className="node add_node" onClick={(e) => { e.stopPropagation(); this.addMember(node) }}>
                        {
                            this.props.isEditLocation &&
                            <>
                                <i className="fa fa-square" ></i>
                                <a >Add New</a>
                            </>
                        }
                    </div>
                </li>
            </ul>
        );
    }

    getNodes = () => {
        // console.log(this.props.isEditLocation)
        // if (typeof this.state?.data?.name === 'undefined') return null;
        let children = this.makeChildren(this.state?.data?.children);

        let root = (
            <span className="root">{this.state?.data?.name}
                <span className="actions"> &nbsp;  &nbsp;
                    {
                        this.props.isEditLocation &&
                        <>
                            <i className="fa fa-pencil" onClick={(e) => { e.stopPropagation(); this.makeEditable(this.state?.data) }}> edit </i>
                            <i className="fa fa-plus" onClick={(e) => { e.stopPropagation(); this.addChild(this.state?.data) }}> Add_child </i>
                        </>
                    }
                </span>
            </span>
        )
        return (
            <div className="tree">
                {(this.state?.data?.editMode) ? this.nodeEditForm(this.state?.data) : root}
                {children}
            </div>
        );
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-offset-12 col-md-12 col-lg-8">
                    <div className="group_dropdown_content">
                        {this.getNodes()}
                    </div>
                </div>
            </div>
        );
    }
}

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



