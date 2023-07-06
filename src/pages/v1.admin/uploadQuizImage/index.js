import React, { useState, useRef } from 'react'
import Parent from "../../../components/Parent";
import styled from 'styled-components'
import { Button, Input } from 'antd'
import Header from './Header'
import firebase from 'firebase/app'

const uploadQuizImage = firebase.app().functions('asia-southeast1').httpsCallable('v3-admin-uploadQuizImage')

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 16px;
`

const FlexRow = styled.div`
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
`

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-width: 100%;
    max-height: 100%;
`

const StyledImg = styled.img`
    max-width: 400px;
    max-height: 400px;
    border: ${props => props.toggle ? '3px solid #0074D9' : 'none'};
    border-radius: 3%;
`

function PageUploadQuizImage() {
    const parent = useRef(Parent);
    const [action, setAction] = useState(false)
    const [files, setFiles] = useState({})
    const [compressedFiles, setCompressedFiles] = useState({})
    const [imageSelection, setImageSelection] = useState({})
    const [uploadTrack, setUploadTrack] = useState({})

    const handleInputOnChange = (event) => {
        setFiles({})
        setCompressedFiles({})
        setImageSelection({})
        setUploadTrack({})

        const files = Object.values(event.target.files);
        if (files.length > 15) {
            return alert("จำนวนไฟล์เกินกำหนด เลือกไฟล์ได้สูงสุดแค่ 15 ไฟล์")
        }

        const compressions = files.map(file => {
            return new Promise(resolve => {
                const image = new Image();
                image.src = URL.createObjectURL(file);
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');

                image.onload = () => {
                    const fileName = file.name;
                    const width = image.width;
                    const height = image.height;
                    const maxDimension = 400;
                    const scale = Math.min(maxDimension / width, maxDimension / height);
                    canvas.width = width * scale;
                    canvas.height = height * scale;
                    context.drawImage(image, 0, 0, canvas.width, canvas.height);
                    canvas.toBlob(blob => {
                        resolve({ [fileName]: blob });
                    }, 'image/jpeg', 1);
                };
            });
        });

        Promise.all(compressions).then(results => {
            const compressedFiles = results.reduce((acc, result) => ({ ...acc, ...result }), {});
            setFiles(files.reduce((acc, file) => {
                acc[file.name] = file
                return acc
            }, {}));
            setCompressedFiles(prevState => ({ ...prevState, ...compressedFiles }));
        });
    }

    const handleImageSelect = (event) => {
        const fileName = event.target.alt
        setImageSelection({ ...imageSelection, [fileName]: event.target.id })
    }

    const handleSubmit = async (event) => {
        const uploadArray = Object.entries(imageSelection);

        if (uploadArray.length === Object.keys(files).length && Object.keys(files).length > 0) {
            try {
                for (const [fileName, version] of uploadArray) {
                    const file = version === 'modified-image' ? compressedFiles[fileName] : files[fileName];
                    const dataUrl = await readFileAsDataURL(file);
                    await uploadQuizImage({ blob: dataUrl, fileName, type: file.type })
                        .then(result => {
                            setUploadTrack((prevTrack) => ({ ...prevTrack, [fileName]: 'success' }));
                        })
                        .catch(error => {
                            setUploadTrack((prevTrack) => ({ ...prevTrack, [fileName]: 'error' }));
                        });
                }
                if (Object.values(uploadTrack).every(result => result === 'success')) {
                    alert('All images has been uploaded')
                } else {
                    alert('There are some error, TextField with red border is the file that error, try again or contract developer')
                }
            } catch (error) {
                console.log(error);
                alert('Error uploading files. Please try again.');
            }
        } else {
            alert('Please select all files to upload.');
        }
    };

    const readFileAsDataURL = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
        });
    };

    return (
        <Parent ref={parent}>
            <div>
                <Header />
                <Container>
                    {
                        action === 'loading' ?
                            `กำลังโหลด...`
                            :
                            <>
                                <FlexRow>
                                    <input type='file' accept='image/*' multiple id='image-picker' name='image-picker' style={{ display: 'none' }} onChange={handleInputOnChange} />
                                    <Button type='primary' style={{ margin: 0 }} onClick={() => {
                                        document.getElementById("image-picker").click()
                                    }}>เลือกรูป</Button>
                                    <Input
                                        disabled
                                        readOnly
                                        value={`ไฟล์ที่เลือก ${Object.keys(files).length} ไฟล์: ${Object.keys(files).length > 0 ? Object.values(files).map(file => file.name).toString() : ''} `}
                                    />
                                </FlexRow>
                                {
                                    Object.keys(files).length > 0 &&
                                    Object.values(files).map((file) => {
                                        return <FlexColumn key={file.name}>
                                            <Input
                                                style={{ borderColor: uploadTrack[file.name] == 'success' ? 'green' : uploadTrack[file.name] === 'error' ? 'red' : '', borderWidth: '3px' }}
                                                disabled
                                                readOnly
                                                value={file.name}
                                            />
                                            <FlexRow>
                                                <FlexColumn>
                                                    <StyledImg
                                                        id='original-image'
                                                        src={URL.createObjectURL(file)}
                                                        alt={file.name}
                                                        toggle={imageSelection[file.name] == 'original-image' ? true : false}
                                                        onClick={handleImageSelect}
                                                    />
                                                    <label>Original Image</label>
                                                    <label>{`Size: ${Math.round(file.size / 1000)} KB`}</label>
                                                </FlexColumn>
                                                <FlexColumn>
                                                    <StyledImg
                                                        id='modified-image'
                                                        src={compressedFiles[file.name] ? URL.createObjectURL(compressedFiles[file.name]) : null}
                                                        alt={file.name}
                                                        toggle={imageSelection[file.name] == 'modified-image' ? true : false}
                                                        onClick={handleImageSelect}
                                                    />
                                                    <label>Modified Image</label>
                                                    {compressedFiles[file.name] && <label>{`Size: ${Math.round(compressedFiles[file.name].size / 1000)} KB`}</label>}
                                                </FlexColumn>
                                            </FlexRow>
                                        </FlexColumn>
                                    })
                                }
                                {
                                    Object.keys(files).length > 0 && <Button type='primary' style={{ margin: 0, maxWidth: '10rem' }} onClick={handleSubmit}>อัพโหลดรูปทั้งหมด</Button>
                                }
                            </>
                    }
                </Container>
            </div>
        </Parent >
    )
}

export default PageUploadQuizImage