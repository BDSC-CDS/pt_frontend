import { toast, ToastContent, ToastOptions, Slide, Id } from "react-toastify"
import { FaCheckCircle } from "react-icons/fa";

export const defaultToastOptions: ToastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Slide,
    className: "shadow-lg border rounded-lg",
}    

type ToastType = "success" | "error" | "info" | "warning" | "default"    

/**
 * Display toast
 *
 * @param {ToastType} type
 * @param {ToastContent} content
 * @param {ToastOptions} [options=defaultToastOption]
 * @return {Id}
 */
export const showToast = (
    type: ToastType,
    content: ToastContent,
    options: Partial<ToastOptions> = {},
): Id => {
    const optionsToApply: ToastOptions = {
        ...defaultToastOptions,
        ...options
    }

    switch (type) {
        case "success":
            optionsToApply.className += " ";
            return toast.success(content, optionsToApply)    
        case "error":
            optionsToApply.className += " ";
            return toast.error(content, optionsToApply)    
        case "info":
            optionsToApply.className += " ";
            return toast.info(content, optionsToApply)    
        case "warning":
            optionsToApply.className += " ";
            return toast.warn(content, optionsToApply)    
        case "default":
            return toast(content, optionsToApply)    
        default:
            return toast(content, optionsToApply)    
    }
    
}    
