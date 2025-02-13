import { useAuth } from "~/utils/authContext"
import LoginModal from "./modals/LoginModal"
import Spinner from "./ui/Spinner"
import React from "react"

/**
 * Higher-Order Component which can wrap pages to enforce authentication on it.
 */
export default function withAuth(WrappedComponent: React.FC) {
    return (props: any) => {
        const { isLoggedIn, isLoading, isAuthModalOpen, hideAuthModal } = useAuth();

        return (
            <>
                {!isLoggedIn  ? (
                    <>
                        {isLoading && <Spinner/>}
                        <LoginModal show={isAuthModalOpen} onClose={() => hideAuthModal}/>
                    </>
                ) : (
                    <WrappedComponent {...props} />
                )}
            </>
        )
    }
}