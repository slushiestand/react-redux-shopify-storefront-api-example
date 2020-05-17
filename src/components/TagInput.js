import React, { useState } from 'react'

export default (props) => {
    const [tag, setTag] = useState('')

    const handleClick = () => {
        console.warn(tag)
        props.handleTag(tag)
    }
    return (
        <>
            <label className="Product__option">
                Tag: <input className="form-control" type="text" onChange={(e) => setTag(e.target.value)}></input>
            </label>
            <button onClick={handleClick}>
                Find products!
        </button>
        </>
    )
}