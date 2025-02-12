import {toast, ToastOptions} from "react-hot-toast"


type ToastType = "success" | "error" | "custom" | "default"
 
const defaultToastOptions: ToastOptions = {
    duration: 3000,
    className: "border rounded-lg text-gray-500 shadow dark:bg-gray-800 dark:text-gray-400",
    style: {}
}
/**
 * Display toast
 *
 * @param {ToastType} type
 * 
 * @param {} content
 * @return {Id}
 */
export const showToast = (
    type: ToastType,
    content: string | JSX.Element,
    options: Partial<ToastOptions> = {},
) => {
    const optionsToApply: ToastOptions = {
        ...defaultToastOptions,
        ...options
    }     

    switch (type) {
        case "success":
            optionsToApply.iconTheme={primary: "#316278", secondary: "#FFFFFF"}
            return toast.success(content, optionsToApply)    
        case "error":
            return toast.error(content, optionsToApply)    
        case "custom":
            return toast.custom(content, optionsToApply);
        default:
            return toast(content, optionsToApply)    
    }
}    
