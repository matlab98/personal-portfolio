"use client"

import {
    motion,
    useScroll,
    useSpring,
    useTransform,
} from "motion/react"
import { useRef } from "react"
import "./Parallax.css" // Importamos el archivo CSS

function Parallax({ id, title, content }) {
    const ref = useRef(null)

    return (
        <section className="section-container">
            <div ref={ref}>
                
                <p>{content}</p>
            </div>
        </section>
    )
}

export default Parallax;
