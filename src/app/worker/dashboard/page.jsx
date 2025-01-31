"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Eye, Search, Bell, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import jwtDecode from 'jsonwebtoken/decode'
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [CurrentTab, setCurrentTab] = useState("Current");
  const [user, setUser] = useState(null)
  const [currentPieces, setCurrentPieces] = useState([])
  const [inComingPieces, setIncomingPieces] = useState([])

  useEffect(() => {

    async function fetchUser() {
      const token = localStorage.getItem('token')

      if (token) {
        const decodedToken = jwtDecode(token)
        const userId = decodedToken.user.id
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
        const response = await axios.get(`${apiBaseUrl}/admin/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        })
        setUser(response.data.data)

      } else {
        router.push("/");
      }
    }

    fetchUser();

  }, [])

  useEffect(() => {
    async function fetchPieces() {
      const token = localStorage.getItem('token')
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
      const response = await axios.get(`${apiBaseUrl}/worker/piece?sectionNumber=${user?.section?.number}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })

      setCurrentPieces(response.data.data.currentPieces)
      setIncomingPieces(response.data.data.inComingPieces)
    }

    if (user?.section?.number) {
      fetchPieces();
    }

  }, [user])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Project Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span className="font-medium text-white">{user?.fullName}</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800 bg-opacity-30 backdrop-filter backdrop-blur-lg border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Assigned Section</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-white">{user?.section?.name}</p>
              <Badge className="mt-2 bg-blue-500 bg-opacity-50 text-white">In Progress</Badge>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 bg-opacity-40 backdrop-filter backdrop-blur-lg border border-gray-700 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Pieces</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentPieces?.length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 bg-opacity-40 backdrop-filter backdrop-blur-lg border border-gray-700 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">InComing Pieces</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {inComingPieces?.length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <Tabs value={CurrentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid w-[400px] grid-cols-2 bg-gray-800 mb-4"> {/* Added margin-bottom here */}
              <TabsTrigger
                value="Current"
                className="flex justify-center items-center py-2 data-[state=active]:bg-white data-[state=active]:text-black">
                Current
              </TabsTrigger>
              <TabsTrigger
                value="InComing"
                className="flex justify-center items-center py-2 data-[state=active]:bg-white data-[state=active]:text-black">
                InComing
              </TabsTrigger>
            </TabsList>

            <TabsContent value="Current">
              <ProjectTable Pieces={currentPieces} User={user} />
            </TabsContent>

            <TabsContent value="InComing">
              <ProjectTable Pieces={inComingPieces} User={user} />
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </div>
  );
}

function ProjectTable({ Pieces, User }) {
  const router = useRouter();
  return (
    <div className="rounded-md bg-gray-800 bg-opacity-40 backdrop-filter backdrop-blur-lg border border-gray-700 text-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-400">ID</TableHead>
            <TableHead className="text-gray-400">Project Name</TableHead>
            <TableHead className="text-gray-400">Drawings PDF</TableHead>
            {User?.section?.number == 1 && <TableHead className="text-gray-400">Cutting Sheet</TableHead>}
            <TableHead className="text-gray-400">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {/* Make sure you're rendering rows */}
          {Pieces?.length > 0 ? (
            Pieces.map((piece) => (
              <TableRow key={piece._id}>
                <TableCell className="font-medium text-white">{piece._id}</TableCell>
                <TableCell className="text-white">{piece.orderId?.projectName}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-transparent text-blue-400 hover:text-blue-300"
                    onClick={() => window.open(piece.orderId?.drawings[0]?.url, "_blank")}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    View Drawing
                  </Button>
                </TableCell>
                {User?.section?.number === 1 && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-transparent text-blue-400 hover:text-blue-300"
                      onClick={() => window.open(piece.orderId?.drawings[1]?.url, "_blank")}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      View Sheet
                    </Button>
                  </TableCell>
                )}
                <TableCell>
                  <Button variant="outline" size="sm" className="bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => { router.push(`/worker/piece/${piece._id}`); }}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="6" className="text-center text-gray-400">No pieces found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

