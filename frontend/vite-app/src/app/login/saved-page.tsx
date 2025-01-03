import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Card } from "@/components/ui/card"
import { Separator } from "@radix-ui/react-select"
import { GalleryVerticalEnd, Terminal } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"

export default function SavedPage() {    
    const [productList, setProductList] = useState([])
    const [emptyList, setEmptyList] = useState(false)
    const [loading, setLoading] = useState(true)
    const [userEmail, setUserEmail] = useState('')
    const { toast } = useToast()
    const navigate = useNavigate()

    function getSessionId() {
        const cookies = document.cookie.split(';')
     
        for (let cookie of cookies) {
          cookie = cookie.trim()
          if (cookie.startsWith('sessionId=')) {
            const sessionId = cookie.split('=')[1]
            return sessionId
          }
        }
        return null
      }

    function removeItem(id : string) {
        axios.post(`http://${import.meta.env.VITE_BACKEND_IP}:${import.meta.env.VITE_BACKEND_PORT}/deleteitem`, {
            email: userEmail,
            id: id
        })
        .then( (response) => {
            console.log(response)
        })
        .catch( (error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        const sessionId = getSessionId()
        axios.post(`http://${import.meta.env.VITE_BACKEND_IP}:${import.meta.env.VITE_BACKEND_PORT}/getemail`, {
            sessionId: sessionId
        })
        .then( (response) => {
            setUserEmail(response.data.email)
        })
        .catch( (error) => {
            console.log(error)
        })
    }, [])

    useEffect(() => {
        if (userEmail) {
            axios.post(`http://${import.meta.env.VITE_BACKEND_IP}:${import.meta.env.VITE_BACKEND_PORT}/getsaveditems`, 
            {
                email: userEmail,
            })
            .then( (response) => {
                setProductList(response.data.userItems)
                console.log(productList)
                setLoading(false)
            })
            .catch( (error) => {
                console.log(error)
            })
    }
    }, [userEmail])

    useEffect(()=> {
        if (productList.length === 0) {
            setEmptyList(true)
        }
        else {
            setEmptyList(false)
        }
    }, [productList])

    return (
        <>
        <div className="p-10 flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
            </div>
            <div className="flex justify-between w-full">
                <span>SmartSort</span>
                <span>Saved items: {userEmail}</span>
            </div>
        </div>
        
        <Separator className="my-1 border border-orange-400 w-10/12 mx-auto" />

        <div className="ml-auto mr-auto w-8/12 flex flex-col items-center gap-6
         bg-zinc-950 p-6 md:p-10 font-bold">
            <Card className="w-8/12 p-6 shadow-lg rounded-xl bg-zinc-900
            border border-zinc-100">
            <h1 className="mb-5">Saved Items</h1>
            <Button className="mt-auto" onClick={
                () => {
                    navigate("/dashboard")
                }
            }>Return to dashboard</Button>
            </Card>
        </div>

        <div>
            <ul>
            {loading ? 
            <div className="flex flex-col items-center gap-6justify-center p-6 md:p-10">
                <Alert className="w-96 border border-orange-400">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Loading...</AlertTitle>
                    <AlertDescription>Items are loading...</AlertDescription>
                </Alert>
            </div> : 
            emptyList ? 
            <div className="flex flex-col items-center gap-6justify-center p-6 md:p-10">
                <Alert className="w-96 border border-orange-400">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>No Saved Items</AlertTitle>
                    <AlertDescription>Items saved on your Dashboard can be viewed here</AlertDescription>
                </Alert>
            </div> :
            productList.map((product, index) => (
                <Card key = {index}
                className="flex items-center gap-4 p-4 bg-zinc-800 rounded-lg shadow-md my-10
                justify-center w-10/12 mx-auto border border-indigo-100"
                >
                    {/* Product Image */}
                    {/* Check if the product has images first, then display */}
                    {product["image"] === undefined ? <img src = "" alt = "No image available" className="ml-auto"></img>
                        : 
                        <img
                        src={product["image"]["imageUrl"]}
                        alt={"Couldn't load image"}
                        className="w-2/12 h-auto object-cover rounded-md ml-auto"
                        />
                    }   
                    {/* Product Title */}
                    <div className="flex flex-col mr-auto ml-auto">
                            {/* Product URL */}
                            <a
                                href={product["itemWebUrl"]}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <h3 className="font-semibold">{product['title']}</h3>
                            </a>
                            <div className="mt-2">
                                <p>Price: ${product['price']['value']}</p>
                            </div>
                    </div>
                    {/* Delete Saved Item */}
                    <div className="ml-auto mr-10">
                        <Button variant = 'destructive' onClick={() => {
                            removeItem(product['itemId'])
                            toast({
                                title: "Item Deleted form Saved Items",
                                description: "Refresh to view changes",
                            })
                            }
                        }>Remove Item</Button>
                    </div>
                </Card>
            ))}
            </ul>
        </div>
        </>
    )
}