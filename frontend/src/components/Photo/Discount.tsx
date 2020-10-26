import React, {useState, useEffect} from 'react'
import Form from "react-bootstrap/Form"

export default function Discount(props: { price: number | undefined; deactivateUploadButton: () => void; activateUploadButton: () => void; onChange: (arg0: number) => void; discountDef: number | undefined; }) {
    const [discountErrMsg, setErrMsg] = useState("")
    const [discountedPrice, setDiscountPrice] = useState(props.price)
    const [valid, setValid] = useState(true)
    
    useEffect(() => {
        if (props.discountDef !== undefined) {
            setDiscount(props.discountDef)
        }
    }, [props.price])

    function setDiscount(discount: number) {
        // Check if discount is valid
        if (!Number.isInteger(discount)) { 
            props.deactivateUploadButton();
            setErrMsg("Please enter a whole number.")
            setValid(false)
          } else if (discount < 0 || discount > 100) {
            props.deactivateUploadButton();
            setErrMsg("Please enter a positive number between 0 and 100.")
            setValid(false)
          } else {
            props.activateUploadButton();
            setErrMsg("")
            setValid(true)
          }
          if (props.price !== undefined) {
            setDiscountPrice(Math.floor((1-discount/100)*props.price))
            props.onChange(discount);
          }
    }

    return(
        <>
            <Form.Group controlId="exampleForm.ControlSelect2">
            <Form.Label>Discount</Form.Label>
            <Form.Control required type="number" onChange={(e) => setDiscount(Number(e.target.value))}/>
            <Form.Text className="text-muted titleInfo">
                Discount must be a percentage between 0 to 100. 
                Discount is rounded down.
                <p className="error">{discountErrMsg}</p>
            </Form.Text>
            </Form.Group>
            {valid ?
            <p style={{fontSize: "13px"}}>{props.discountDef}% off original price: <s>{props.price} credits</s> ... NOW <b>{discountedPrice} credits.</b></p>
            : <></>
            }
        </>
    )
}