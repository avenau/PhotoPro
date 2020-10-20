import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./PhotoDetails.scss";

import { Link, useHistory, useLocation } from "react-router-dom";
import Axios from "axios";
import Toolbar from "../../components/Toolbar/Toolbar";
import PhotoComments from "../../components/PhotoComments/PhotoComments";
import PhotoContents from "../../components/PhotoContents/PhotoContents";

export default function PhotoDetails() {


    return (
        <div>
            <Toolbar />
            <PhotoContents />
            <PhotoComments />

        </div>
    );

}
