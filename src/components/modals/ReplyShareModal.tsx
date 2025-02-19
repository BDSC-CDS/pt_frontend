import { Badge, Button, Modal, Table, TextInput } from "flowbite-react"
import { useRouter } from "next/router"
import { useState } from "react"
import { FaUser } from "react-icons/fa6"
import { MdCancel } from "react-icons/md"
import { useAuth } from "~/utils/authContext"
import { shareReply } from "~/utils/questionnaire"
import { showToast } from "~/utils/showToast"
import { searchUsers } from "~/utils/user"
import DataTable from "../DataTable"
import Spinner from "../ui/Spinner"

interface ReplyShareModalProps {
    show: boolean
    shareReplyId: number
    onClose: () => void
}

type User = {
    id: number
    email: string
}


/**
 * Modal .
 */
export default function ReplyShareModal({ show, shareReplyId, onClose }: ReplyShareModalProps) {
    const [emailLike, setEmailLike] = useState<string>('')
    const [users, setUsers] = useState<Array<User>>([])
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleSearchUsers = async (emailLike: string) => {
        setEmailLike(emailLike)
        if(emailLike.length == 0) {
            setUsers([])
            return
        }

        try {
            const response = await searchUsers(emailLike.toLowerCase())
            if(!response) return
            console.log(response)
            setUsers(response.map((user: any) => {
                return {
                    id: user.id,
                    email: user.email
                }
            }))
        } catch (error) {
            console.log("Error searching users:" + error)
        }
    }

    const handleSelectUser = (user: User) => {
        if(!selectedUsers.find(u => u.id === user.id)){
            setSelectedUsers([...selectedUsers, user])
        }
    }

    const handleRemoveUser = (user: User) => {
        setSelectedUsers(selectedUsers.filter(u => u.id !== user.id))
    }

    const handleShare = () => {
        try {
            setIsLoading(true)
            selectedUsers.forEach(user => {
            
                const response = shareReply(shareReplyId, user.id)
                if(!response){
                    throw "No response from server."
                }
                
            })
        } catch (error) {
            showToast("error", "Error sharing reply:"+error)
        } finally {
            setIsLoading(false)
            showToast("success", "Successfully shared reply.")
            onClose()
        }
    };

    const handleCancel = () => {
        setEmailLike("")
        setUsers([])
        setSelectedUsers([])
        onClose()
    }

    return (
        <Modal show={show} onClose={onClose} size="lg">
            <Modal.Header>
                Share Questionnaire Reply
            </Modal.Header>

            <Modal.Body className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                    {selectedUsers.length > 0 && selectedUsers.map((user) => (
                        <div className="flex" key={user.id}>
                            <Badge color="gray" className="px-3" size={"sm"} icon={FaUser}>{user.email}</Badge>
                            <MdCancel className="text-gray-400 hover:text-red-500" onClick={() => handleRemoveUser(user)}/>
                        </div>
                        
                    ))}
                </div>
                
                <TextInput
                    placeholder="Search email"
                    value={emailLike}
                    onChange={(event) => { handleSearchUsers(event.target.value) }}
                />

                {users.length > 0 && (
                    <DataTable data={users} columns={[{header:"Id", name:"id"}, {header: "Email", name: "email"}]} onRowClick={handleSelectUser} />
                )}
            </Modal.Body>

            <Modal.Footer className="flex justify-center gap-3">
                <Button onClick={handleShare}>{isLoading ? <Spinner/> : "Share"}</Button>
                <Button color="gray" onClick={handleCancel}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    )   
}