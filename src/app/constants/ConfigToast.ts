import { ToastOptions } from "react-toastify";

/**
 * Tipos de toast
 * default, error, info, success, warning
 */

export const CONFIG_TOAST: ToastOptions = {
    position: "top-right",
    autoClose: 1200,
    hideProgressBar: false,
    closeOnClick: true,
    theme: "light"
};