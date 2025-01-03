import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Card } from "@/components/ui/card"
import { Separator } from "@radix-ui/react-select"
import { GalleryVerticalEnd, Terminal } from "lucide-react"
import { Label } from "@radix-ui/react-label"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"

export default function Dashboard() {    
    const [query, setQuery] = useState('')
    const [productList, setProductList] = useState([])
    const [limit, setLimit] = useState('0')
    const [emptyList, setEmptyList] = useState(true)
    const [userEmail, setUserEmail] = useState('')
    const {toast} = useToast()
    const navigate = useNavigate()

    function saveItem(id: string) {
        axios.post(`http://${import.meta.env.VITE_BACKEND_IP}:${import.meta.env.VITE_BACKEND_PORT}/saveitem`, {
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

    const fetchList = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    
        axios.post(`http://${import.meta.env.VITE_BACKEND_IP}:${import.meta.env.VITE_BACKEND_PORT}/fetchlist`, {
          query: query,
          limit: limit,
        })
        .then( (response) => {
          console.log(response)
          setProductList(response.data)
          setEmptyList(false)          
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

    return (
        <>
        <div className="p-10 flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
            </div>
            <div className="flex justify-between w-full">
                <span>SmartSort</span>
                <span>Welcome, {userEmail}</span>
            </div>
        </div>
        
        <Separator className="my-1 border border-orange-400 w-10/12 mx-auto" />

        <span>

        </span>

        <div className="flex flex-col items-center gap-6 bg-zinc-950 p-6 md:p-10">
            <Card className="w-8/12 p-6 shadow-lg rounded-xl bg-zinc-800
            border border-zinc-700">
                <form onSubmit={fetchList}>
                    <div className="flex items-center">
                        <div className = "flex items-center">           
                            <Label className="mr-4"> Query: </Label> 
                        </div>
                    <Input onChange = { (e) => setQuery(e.target.value)} required/>
                        <div className="ml-10 mr-10 flex items-center">
                            <Label className="mr-5">Number of items: </Label>
                            <Input className = "w-20" type="number" min = "1" max="20"
                                onChange = { (e) => setLimit(e.target.value)} required/>
                        </div>
                    </div>  
                    <Separator className="my-4" />
                    <Button type = "submit">Send</Button>  
                    <Button variant = "default" onClick = {() => navigate("/saved")} className="ml-20">
                    View Saved items</Button>
                </form>
            </Card>
        </div>

        <div>
            <ul>
            {emptyList ? 
            <div className="flex flex-col items-center gap-6justify-center p-6 md:p-10">
                <Alert className="w-96 border border-orange-400">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Empty List</AlertTitle>
                    <AlertDescription>Enter a search to get started</AlertDescription>
                </Alert>
            </div> : productList.map((product, index) => (
                <Card key = {index}
                className="flex items-center gap-4 p-4 bg-zinc-800 rounded-lg shadow-md my-10
                justify-center w-10/12 mx-auto border border-indigo-100"
                >
                    {/* Product Image */}
                    {/* Check if the product has images first, then display */}
                    {product["image"] === undefined ? <img src = "" alt = "No image available" className="ml-auto"></img>
                        : <img
                        src={product["image"]["imageUrl"]}
                        alt={"Couldn't load image"}
                        className="w-auto h-auto object-cover rounded-md ml-auto"
                        />
                    }   
                    {/* Product Title */}
                    <div className="flex flex-col">
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
                    {/* Save item */}
                    <div className="ml-auto mr-10">
                        <Button onClick={() => {
                            saveItem(product['itemId'])
                            toast({
                                description: "Item Added to Saved Items",
                            })
                            }
                        }>Save Item</Button>
                    </div>
                </Card>
            ))}
            </ul>
        </div>
        </>
    )
}