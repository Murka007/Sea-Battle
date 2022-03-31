import React from "react";
import Classes from "./Button.module.css";

function Button({ children, disabled, className, ...args }) {
    const classNames = className.split(" ");
    const classList = [Classes[classNames.splice(0, 1)], ...classNames];
    if (disabled) {
        classList.push(Classes.disabled);
    }
    return (
        <button
            className={classList.join(" ")}
            {...args}
        >
            {children}
        </button>
    );
}

export default Button;