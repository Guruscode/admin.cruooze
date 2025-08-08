"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, RefreshCw, CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { DateRangePicker } from "@/components/date-range-picker"
import type { DateRange } from "react-day-picker"

// Mock transaction data
const transactions = [
  {
    id: "TXN17515754945571",
    ref: "REF17515754945571",
    user: {
      name: "Chinedu Okwu",
      email: "vendor1@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    type: "credit",
    amount: 26237.94,
    category: "Deposit",
    status: "completed",
    date: "03/07/2025",
    time: "21:44:54",
  },
  {
    id: "TXN17515754945572",
    ref: "REF17515754945572",
    user: {
      name: "Ahmed Usman",
      email: "user3@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    type: "credit",
    amount: 39164.59,
    category: "Refund",
    status: "completed",
    date: "03/07/2025",
    time: "21:44:54",
  },
  {
    id: "TXN17515754945573",
    ref: "REF17515754945573",
    user: {
      name: "Fatima Ibrahim",
      email: "user4@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    type: "debit",
    amount: 15000,
    category: "Payment",
    subcategory: "Private Motor Vehicle",
    status: "completed",
    date: "03/07/2025",
    time: "19:30:22",
  },
  {
    id: "TXN17515754945574",
    ref: "REF17515754945574",
    user: {
      name: "Kemi Adebayo",
      email: "user5@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    type: "debit",
    amount: 7500,
    category: "Withdrawal",
    status: "pending",
    date: "03/07/2025",
    time: "17:15:10",
  },
  {
    id: "TXN17515754945575",
    ref: "REF17515754945575",
    user: {
      name: "Bola Adeyemi",
      email: "bola@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    type: "credit",
    amount: 12500,
    category: "Deposit",
    status: "completed",
    date: "02/07/2025",
    time: "16:30:15",
  },
  {
    id: "TXN17515754945576",
    ref: "REF17515754945576",
    user: {
      name: "Tunde Okafor",
      email: "tunde@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    type: "debit",
    amount: 8750,
    category: "Payment",
    subcategory: "Commercial Vehicle",
    status: "completed",
    date: "02/07/2025",
    time: "14:22:33",
  },
  {
    id: "TXN17515754945577",
    ref: "REF17515754945577",
    user: {
      name: "Grace Nwosu",
      email: "grace@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    type: "credit",
    amount: 45000,
    category: "Refund",
    status: "pending",
    date: "02/07/2025",
    time: "13:15:42",
  },
  {
    id: "TXN17515754945578",
    ref: "REF17515754945578",
    user: {
      name: "Emeka Obi",
      email: "emeka@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    type: "debit",
    amount: 22000,
    category: "Withdrawal",
    status: "completed",
    date: "01/07/2025",
    time: "18:45:12",
  },
  {
    id: "TXN17515754945579",
    ref: "REF17515754945579",
    user: {
      name: "Aisha Mohammed",
      email: "aisha@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    type: "credit",
    amount: 18500,
    category: "Deposit",
    status: "completed",
    date: "01/07/2025",
    time: "12:30:55",
  },
  {
    id: "TXN17515754945580",
    ref: "REF17515754945580",
    user: {
      name: "Segun Bakare",
      email: "segun@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    type: "debit",
    amount: 9200,
    category: "Payment",
    subcategory: "Motorcycle",
    status: "failed",
    date: "01/07/2025",
    time: "10:15:28",
  },
  {
    id: "TXN17515754945581",
    ref: "REF17515754945581",
    user: {
      name: "Funmi Adebayo",
      email: "funmi@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    type: "credit",
    amount: 35000,
    category: "Refund",
    status: "completed",
    date: "30/06/2025",
    time: "17:20:10",
  },
  {
    id: "TXN17515754945582",
    ref: "REF17515754945582",
    user: {
      name: "Yusuf Garba",
      email: "yusuf@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    type: "debit",
    amount: 14750,
    category: "Payment",
    subcategory: "Private Motor Vehicle",
    status: "completed",
    date: "30/06/2025",
    time: "15:45:33",
  },
  {
    id: "TXN17515754945583",
    ref: "REF17515754945583",
    user: {
      name: "Chioma Eze",
      email: "chioma@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    type: "credit",
    amount: 28000,
    category: "Deposit",
    status: "pending",
    date: "30/06/2025",
    time: "11:30:45",
  },
  {
    id: "TXN17515754945584",
    ref: "REF17515754945584",
    user: {
      name: "Ibrahim Sule",
      email: "ibrahim@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    type: "debit",
    amount: 6500,
    category: "Withdrawal",
    status: "completed",
    date: "29/06/2025",
    time: "16:10:22",
  },
  {
    id: "TXN17515754945585",
    ref: "REF17515754945585",
    user: {
      name: "Ngozi Okoro",
      email: "ngozi@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    type: "credit",
    amount: 52000,
    category: "Refund",
    status: "completed",
    date: "29/06/2025",
    time: "14:25:18",
  },
  {
    id: "TXN17515754945586",
    ref: "REF17515754945586",
    user: {
      name: "Adamu Bello",
      email: "adamu@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    type: "debit",
    amount: 19500,
    category: "Payment",
    subcategory: "Commercial Vehicle",
    status: "completed",
    date: "29/06/2025",
    time: "09:40:55",
  },
]

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Calculate totals
  const totalTransactions = transactions.length
  const totalCredit = transactions.filter((t) => t.type === "credit").reduce((sum, t) => sum + t.amount, 0)
  const totalDebit = transactions.filter((t) => t.type === "debit").reduce((sum, t) => sum + t.amount, 0)

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterType === "all" || transaction.type === filterType

    return matchesSearch && matchesFilter
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-start md:justify-between md:space-y-0">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">Monitor all platform transactions</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            <span>Total transactions: {totalTransactions}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DateRangePicker className="h-10" dateRange={dateRange} onDateRangeChange={setDateRange} />
          <Button variant="outline" className="h-10 bg-transparent">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Credit</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalCredit)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Debit</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalDebit)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Transaction History</h3>
          <p className="text-sm text-muted-foreground">All platform transactions and payments</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="credit">Credit</SelectItem>
              <SelectItem value="debit">Debit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transactions Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={transaction.user.avatar || "/placeholder.svg"} alt={transaction.user.name} />
                        <AvatarFallback>{getInitials(transaction.user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{transaction.user.name}</div>
                        <div className="text-sm text-muted-foreground">{transaction.user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{transaction.id}</div>
                      <div className="text-sm text-muted-foreground">{transaction.ref}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {transaction.type === "credit" ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                      )}
                      <Badge
                        variant="secondary"
                        className={
                          transaction.type === "credit" ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
                        }
                      >
                        {transaction.type}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        transaction.type === "credit" ? "text-green-600 font-medium" : "text-red-600 font-medium"
                      }
                    >
                      {transaction.type === "credit" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{transaction.category}</div>
                      {transaction.subcategory && (
                        <div className="text-sm text-muted-foreground">{transaction.subcategory}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={transaction.status === "completed" ? "default" : "secondary"}
                      className={
                        transaction.status === "completed"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{transaction.date}</div>
                      <div className="text-sm text-muted-foreground">{transaction.time}</div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredTransactions.length)} of{" "}
              {filteredTransactions.length} transactions
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  )
}
