import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useAuth } from "~/utils/authContext"
import LoginModal from "./modals/LoginModal"
import Spinner from "./ui/Spinner"

/**
 * Higher-Order Component which can wrap pages to enforce authentication on it.
 */
export default function withAuth(WrappedComponent: React.FC) {
    return (props: any) => {
        const { isLoggedIn, setShowAuthModal } = useAuth()
        const [loading, setLoading] = useState(true)

        useEffect(() => {
            if (!isLoggedIn) {
                setShowAuthModal(true) // Show the auth modal if the user is not logged in
            } else {
                setLoading(false)
            }
        }, [isLoggedIn])

        if(loading) {
            return (
                <>
                    <Spinner/>
                    <LoginModal/>
                </>
            )
        }

        return (
            <>
                <WrappedComponent {...props} />
            </>
        )
    }
}