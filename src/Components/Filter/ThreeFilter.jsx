import React, { useState } from 'react'
import { Three_Search_Filter } from './Filter';
import Dropdown from 'react-bootstrap/Dropdown';

const ThreeFilter = ({ Data, setResult, Col1, Col2, Col3, searchName1, searchName2, searchName3 }) => {

    const [filter1, setFilter1] = useState('Contains');
    const [filter2, setFilter2] = useState('Contains');
    const [filter3, setFilter3] = useState('Contains');
    const [searchValue1, setSearchValue1] = useState('');
    const [searchValue2, setSearchValue2] = useState('');
    const [searchValue3, setSearchValue3] = useState('');
    
    return (
        <div className="col-12 pl-0 ml-0">
            <div className="row ">
                <div className="col-3 col-md-3">
                    <input type="text" onChange={(e) => {
                        setSearchValue1(e.target.value)
                        const result = Three_Search_Filter(Data, e.target.value, searchValue2, searchValue3, filter1, Col1, Col2, Col3)
                        setResult(result);
                    }} className='form-control' placeholder={`Search By ${searchName1} ...`} />
                </div>
                <div className='col-1 col-md-1'>
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            <i className="fa fa-filter"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setFilter1('Contains')}>Contains</Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilter1('is equal to')}>is equal to</Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilter1('is not equal to ')}>is not equal to </Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilter1('Starts With')}>Starts With</Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilter1('End with')}>End with</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className="col-3">
                    <input type="text" onChange={(e) => {
                        setSearchValue2(e.target.value)
                        const result = Three_Search_Filter(Data, searchValue1, e.target.value, searchValue3, filter2, Col1, Col2, Col3)
                        setResult(result)
                    }} className='form-control' placeholder={`Search By ${searchName2} ...`} />
                </div>
                <div className="col-1">
                    <Dropdown>
                        <Dropdown.Toggle variant='primary' id="dropdown-basic">
                            <i className="fa fa-filter"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setFilter3('Contains')}>Contain</Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilter3('is equal to')}>Is Equal to</Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilter3('is Not equal to')}>Is not Equal to</Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilter3('Start With')}>Start with</Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilter3('End With')}>End with</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className="col-3 col-md-3">
                    <input type="text" onChange={(e) => {
                        setSearchValue3(e.target.value)
                        const result = Three_Search_Filter(Data, searchValue1, searchValue2, e.target.value, filter3, Col1, Col2, Col3)
                        setResult(result)
                    }} className='form-control' placeholder={`Search By ${searchName3} ...`} />
                </div>
                <div className='col-1 col-md-1'>
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            <i className="fa fa-filter"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setFilter2('Contains')}>Contains</Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilter2('is equal to')}>is equal to</Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilter2('is not equal to ')}>is not equal to </Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilter2('Starts With')}>Starts With</Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilter2('End with')}>End with</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        </div>
    )
}

export default ThreeFilter