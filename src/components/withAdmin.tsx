import { useAuth } from "~/utils/authContext"
import withAuth from "./withAuth"
import Spinner from "./ui/Spinner"
import React from "react"

/**
 * Higher-Order Component to enforce admin authentication.
 */
export default function withAdmin(WrappedComponent: React.FC) {
    const AuthWrappedComponent = withAuth(WrappedComponent)

    return (props: any) => {
        const { userInfo, isLoading } = useAuth()

        if (isLoading) return <Spinner />

        if (!userInfo?.isAdmin) {
            return <div className="text-center mt-4">Access Denied.</div>
        }

        return <AuthWrappedComponent {...props} />
    }
}
