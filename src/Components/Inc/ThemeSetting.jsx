import React from "react";
import { Link } from "react-router-dom";

const ThemeSetting = () => {
    return (
        <>
            <div id="rightsidebar" className="right_sidebar">
                <Link to="" className="p-3 settingbar float-right"><i className="fa fa-close"></i></Link>
                <div className="p-4">
                    <div className="mb-4">
                        <h6 className="font-14 font-weight-bold text-muted">Font Style</h6>
                        <div className="custom-controls-stacked font_setting">
                            <label className="custom-control custom-radio custom-control-inline">
                                <input type="radio" className="custom-control-input" name="font" value="font-opensans" />
                                <span className="custom-control-label">Open Sans Font</span>
                            </label>
                            <label className="custom-control custom-radio custom-control-inline">
                                <input type="radio" className="custom-control-input" name="font" value="font-montserrat" checked="" />
                                <span className="custom-control-label">Montserrat Google Font</span>
                            </label>
                            <label className="custom-control custom-radio custom-control-inline">
                                <input type="radio" className="custom-control-input" name="font" value="font-roboto" />
                                <span className="custom-control-label">Robot Google Font</span>
                            </label>
                        </div>
                    </div>
                    <hr />
                    <div className="mb-4">
                        <h6 className="font-14 font-weight-bold text-muted">Dropdown Menu Icon</h6>
                        <div className="custom-controls-stacked arrow_option">
                            <label className="custom-control custom-radio custom-control-inline">
                                <input type="radio" className="custom-control-input" name="marrow" value="arrow-a" />
                                <span className="custom-control-label">A</span>
                            </label>
                            <label className="custom-control custom-radio custom-control-inline">
                                <input type="radio" className="custom-control-input" name="marrow" value="arrow-b" />
                                <span className="custom-control-label">B</span>
                            </label>
                            <label className="custom-control custom-radio custom-control-inline">
                                <input type="radio" className="custom-control-input" name="marrow" value="arrow-c" checked="" />
                                <span className="custom-control-label">C</span>
                            </label>
                        </div>
                        <h6 className="font-14 font-weight-bold mt-4 text-muted">SubMenu List Icon</h6>
                        <div className="custom-controls-stacked list_option">
                            <label className="custom-control custom-radio custom-control-inline">
                                <input type="radio" className="custom-control-input" name="listicon" value="list-a" checked="" />
                                <span className="custom-control-label">A</span>
                            </label>
                            <label className="custom-control custom-radio custom-control-inline">
                                <input type="radio" className="custom-control-input" name="listicon" value="list-b" />
                                <span className="custom-control-label">B</span>
                            </label>
                            <label className="custom-control custom-radio custom-control-inline">
                                <input type="radio" className="custom-control-input" name="listicon" value="list-c" />
                                <span className="custom-control-label">C</span>
                            </label>
                        </div>
                    </div>
                    <hr />
                    <div>
                        <h6 className="font-14 font-weight-bold mt-4 text-muted">General Settings</h6>
                        <ul className="setting-list list-unstyled mt-1 setting_switch">
                            <li>
                                <label className="custom-switch">
                                    <span className="custom-switch-description">Night Mode</span>
                                    <input type="checkbox" name="custom-switch-checkbox" className="custom-switch-input btn-darkmode" />
                                    <span className="custom-switch-indicator"></span>
                                </label>
                            </li>
                            <li>
                                <label className="custom-switch">
                                    <span className="custom-switch-description">Fix Navbar top</span>
                                    <input type="checkbox" name="custom-switch-checkbox" className="custom-switch-input btn-fixnavbar" />
                                    <span className="custom-switch-indicator"></span>
                                </label>
                            </li>
                            <li>
                                <label className="custom-switch">
                                    <span className="custom-switch-description">Header Dark</span>
                                    <input type="checkbox" name="custom-switch-checkbox" className="custom-switch-input btn-pageheader" checked="" />
                                    <span className="custom-switch-indicator"></span>
                                </label>
                            </li>

                            <li>
                                <label className="custom-switch">
                                    <span className="custom-switch-description">Sidebar Dark</span>
                                    <input type="checkbox" name="custom-switch-checkbox" className="custom-switch-input btn-sidebar" />
                                    <span className="custom-switch-indicator"></span>
                                </label>
                            </li>
                            <li>
                                <label className="custom-switch">
                                    <span className="custom-switch-description">Icon Color</span>
                                    <input type="checkbox" name="custom-switch-checkbox" className="custom-switch-input btn-iconcolor" />
                                    <span className="custom-switch-indicator"></span>
                                </label>
                            </li>
                            <li>
                                <label className="custom-switch">
                                    <span className="custom-switch-description">Gradient Color</span>
                                    <input type="checkbox" name="custom-switch-checkbox" className="custom-switch-input btn-gradient" />
                                    <span className="custom-switch-indicator"></span>
                                </label>
                            </li>
                            <li>
                                <label className="custom-switch">
                                    <span className="custom-switch-description">Box Shadow</span>
                                    <input type="checkbox" name="custom-switch-checkbox" className="custom-switch-input btn-boxshadow" />
                                    <span className="custom-switch-indicator"></span>
                                </label>
                            </li>
                            <li>
                                <label className="custom-switch">
                                    <span className="custom-switch-description">RTL Support</span>
                                    <input type="checkbox" name="custom-switch-checkbox" className="custom-switch-input btn-rtl" />
                                    <span className="custom-switch-indicator"></span>
                                </label>
                            </li>
                            <li>
                                <label className="custom-switch">
                                    <span className="custom-switch-description">Box Layout</span>
                                    <input type="checkbox" name="custom-switch-checkbox" className="custom-switch-input btn-boxlayout" />
                                    <span className="custom-switch-indicator"></span>
                                </label>
                            </li>
                        </ul>
                    </div>
                    <hr />
                    <div className="form-group">
                        <button type="button" className="btn btn-primary btn-block mt-3">GoldLine</button>
                    </div>
                </div>
            </div>

            <div className="theme_div">
                <div className="card">
                    <div className="card-body">
                        <ul className="list-group list-unstyled">
                            <li className="list-group-item mb-2">
                                <p>Default Theme</p>
                                <Link to=""><img src="assets/images/themes/default.png" className="img-fluid" /></Link>
                            </li>
                            <li className="list-group-item mb-2">
                                <p>Night Mode Theme</p>
                                <Link to=""><img src="assets/images/themes/dark.png" className="img-fluid" /></Link>
                            </li>
                            <li className="list-group-item mb-2">
                                <p>RTL Version</p>
                                <Link to=""><img src="assets/images/themes/rtl.png" className="img-fluid" /></Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ThemeSetting;