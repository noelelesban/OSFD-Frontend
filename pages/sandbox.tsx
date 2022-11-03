// @ts-nocheck
import {
    Button,
    Card,
    CardActionArea,
    CircularProgress,
    IconButton,
    Tab,
    Tabs,
    Tooltip,
    Typography,
    Input,
    TextField,
    Paper
} from "@mui/material";
import { Box } from "@mui/system";
import type { NextPage } from "next";

import { FC, useCallback, useEffect, useState } from "react";
import axios from 'axios';


const Sandbox: NextPage = () => {
    const [uploading, setUploading] = useState(false);
    const [zip, setZip] = useState("");
    const [preview, setPreview] = useState("");
    const [message, setMessage] = useState("");

    async function upload() {
        if (uploading) {
            return;
        }

        setUploading(true)

        const fileInput = document.querySelector('input[type="file"]')
        console.log(fileInput)
        console.log(fileInput.files)


        var formData = new FormData();

        formData.append("file", fileInput.files[0]);

        axios.post(
            'https://sandbox-minter.herokuapp.com/tokens/zip',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        )
            .then(({ data }) => {
                console.log(data.zipName)
                setZip(data.zipName)
                setMessage("")
                console.log('SUCCESS!!');
            })
            .catch(({ response }) => {
                setMessage(response.data)
            })
            .finally(
                () => {
                    setUploading(false)
                })
    }

    useEffect(() => {
        if (zip) {
            axios.get('https://sandbox-minter.herokuapp.com/tokens/preview/' + zip)
                .then(function ({ data }) {
                    console.log(data)
                    setPreview(data);
                })
                .catch(({ response }) => {
                    setMessage(response.data)
                })
        }
    }, [zip]);


    return (
        <Box sx={{ height: "100%", marginTop: 20, }}>
            <div style={{ marginBlock: 20, fontSize: 30, display: "flex", justifyContent: "center", fontWeight: "bold", color: "#19217b" }}>
                Builder Sandbox
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <img src={"./Sandbox.png"}></img>
            </div>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button onClick={() => { window.open("https://whimsical.com/publish-2aKLEyPDbw6yZiULcquYf2", '_blank', 'noopener,noreferrer'); }} style={{ height: 35, backgroundColor: "#1b2f91", color: "white" }}>Publish Instructions </Button>
            </Box>
            <Box style={{ height: 100, display: "flex", justifyContent: "center", padding: 10, alignItems: "center" }}>
                <Input type="file" />
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Button onClick={upload} style={{ height: 35 }}>{uploading ? <img src={"./spinner.svg"} height="100%"></img> : "upload"} </Button>
                </Box>
            </Box>

            {!message &&
                <Box>
                    <Box style={{ display: "flex", justifyContent: "center", padding: 10 }}>
                        {preview &&
                            <div>
                                <div >
                                    <img key={preview.image} src={preview.image} style={{ maxHeight: "70vh" }}></img>
                                </div>
                            </div>
                        }
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Button onClick={() => {
                            if (zip) {
                                axios.get('https://sandbox-minter.herokuapp.com/tokens/preview/' + zip)
                                    .then(function ({ data }) {
                                        console.log(data)
                                        setPreview(data);
                                        setMessage("")
                                    })
                                    .catch(function ({ response }) {
                                        setMessage(response.data)
                                        console.log('FAILURE!!');
                                    })
                            }
                        }} style={{ height: 35 }}>Variation </Button>
                    </Box>
                </Box>}

            <Box sx={{ display: "flex", justifyContent: "center" }}>
                {message}
            </Box>


        </Box >
    );
};

export default Sandbox;