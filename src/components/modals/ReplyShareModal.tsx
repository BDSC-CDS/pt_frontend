import { Badge, Button, Modal, TextInput } from "flowbite-react"
import { useState } from "react"
import { FaUser } from "react-icons/fa6"
import { MdCancel } from "react-icons/md"
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
 * Modal to Share a reply to another user.
 */
export default function ReplyShareModal({ show, shareReplyId, onClose }: ReplyShareModalProps) {
    const [emailLike, setEmailLike] = useState<string>("")
    const [users, setUsers] = useState<Array<User>>([])
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null)

    const handleSearchUsers = async (emailLike: string) => {
        setIsLoading(true)
        setEmailLike(emailLike)
        if(emailLike.length == 0) {
            setIsLoading(false)
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
            showToast("error", "Error searching users:"+error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleEmailLikeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setEmailLike(value);
        setIsLoading(true);

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const newTimeout = setTimeout(() => {
            handleSearchUsers(value);
        }, 300); // Adjust the debounce delay as needed

        setDebounceTimeout(newTimeout);
    };

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
        <Modal show={show} onClose={handleCancel} size="lg">
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
                    onChange={handleEmailLikeChange}
                />
                <div className="h-80 overflow-auto">
                    {isLoading && <Spinner />}
                    {!isLoading && users.length == 0 && (
                        <div className="flex justify-center text-sm items-center h-full">
                            <p>No users found.</p>
                        </div>
                    )}
                    {users.length > 0 && (
                        <DataTable data={users} columns={[{header: "Email", name: "email"}]} onRowClick={handleSelectUser} />
                    )}
                </div>
                
            </Modal.Body>

            <Modal.Footer className="flex justify-center gap-3">
                <Button onClick={handleShare} disabled={selectedUsers.length==0}>Share</Button>
                <Button color="gray" onClick={handleCancel}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    )   
}