// components/common/TableCustom.jsx
import React, { useState, useEffect, useMemo } from "react"
import PropTypes from "prop-types"
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ArrowUp,
    ArrowDown,
    ChevronsUpDown,
    InboxIcon,
} from "lucide-react"

const TableCustom = (props) => {
    const [sortField, setSortField] = useState(props.sortField || "")
    const [sortOrder, setSortOrder] = useState(props.sortOrder || "asc")

    useEffect(() => {
        setSortField(props.sortField || "")
        setSortOrder(props.sortOrder || "asc")
    }, [props.sortField, props.sortOrder])

    const handleSort = (field) => {
        const isAsc = sortField === field && sortOrder === "asc"
        const newOrder = isAsc ? "desc" : "asc"
        setSortField(field)
        setSortOrder(newOrder)
        props.onRequestSort?.(field, newOrder)
    }

    const columns = useMemo(() => {
        return props.columns.map((col) => ({
            id: col.dataField,
            accessorKey: col.dataField,
            header: () => {
                const centered = col.headerAlign === "center"
                if (!col.sort) {
                    return (
                        <div className={centered ? "text-center" : ""}>
                            {col.text}
                        </div>
                    )
                }
                return (
                    <Button
                        variant="ghost"
                        onClick={() => handleSort(col.dataField)}
                        className={`flex items-center gap-2 font-medium hover:text-foreground ${centered ? "mx-auto" : ""}`}
                    >
                        {col.text}
                        {sortField === col.dataField ?
                            (sortOrder === "asc"
                                ? <ArrowUp className="h-3 w-3 mt-0.5" /> : <ArrowDown className="h-3 w-3 mt-0.5" />
                            ) : (
                                <ChevronsUpDown className="h-3 w-3 text-muted-foreground mt-0.5" />
                            )}
                    </Button>
                )
            },
            cell: ({ row }) => {
                const value = row.original[col.dataField]
                return (
                    <div className={col.bodyAlign === "center" ? "flex justify-center" : ""}>
                        {col.formatter ? col.formatter(value, row.original) : value}
                    </div>
                )
            },
        }))
    }, [props.columns, sortField, sortOrder])

    const table = useReactTable({
        data: props.appdata,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        pageCount: props.totalPage,
    })

    const page = props.page || 0
    const rowsPerPage = props.rowsPerPage || 10
    const totalPages = props.totalPage || 1
    const from = props.appdataTotal === 0 ? 0 : page * rowsPerPage + 1
    const to = Math.min((page + 1) * rowsPerPage, props.appdataTotal)

    return (
        <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-lg border">
                <Table>
                    <TableHeader className="bg-muted">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {props.loadingData ? (
                            <TableRow>
                                <TableCell
                                    colSpan={props.columns.length}
                                    className="h-97 text-center text-muted-foreground"
                                >
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={props.columns.length}
                                    className="h-97 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                        <InboxIcon className="h-10 w-10 opacity-40" />
                                        <span className="text-sm">No records to display</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between px-2">
                <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
                    Showing {from} to {to} of {props.appdataTotal} entries
                </div>
                <div className="flex w-full items-center gap-6 lg:w-fit">
                    <div className="hidden items-center gap-2 lg:flex">
                        <Label className="text-sm font-medium">Rows per page</Label>
                        <Select
                            value={String(rowsPerPage)}
                            onValueChange={(value) => props.onRowsPerPageChange?.(Number(value))}
                        >
                            <SelectTrigger size="sm" className="w-20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {props.rowsPerPageOption.map((opt) => (
                                    <SelectItem key={opt} value={String(opt)}>{opt}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex w-fit items-center justify-center text-sm font-medium">
                        Page {page + 1} of {totalPages}
                    </div>

                    <div className="ml-auto flex items-center gap-2 lg:ml-0">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            size="icon"
                            onClick={() => props.onPageChange?.(0)}
                            disabled={page === 0}
                        >
                            <span className="sr-only">Go to first page</span>
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            onClick={() => props.onPageChange?.(page - 1)}
                            disabled={page === 0}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            onClick={() => props.onPageChange?.(page + 1)}
                            disabled={page >= totalPages - 1}
                        >
                            <span className="sr-only">Go to next page</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden size-8 lg:flex"
                            size="icon"
                            onClick={() => props.onPageChange?.(totalPages - 1)}
                            disabled={page >= totalPages - 1}
                        >
                            <span className="sr-only">Go to last page</span>
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

TableCustom.propTypes = {
    loadingData: PropTypes.bool.isRequired,
    keyField: PropTypes.string.isRequired,
    columns: PropTypes.array.isRequired,
    appdata: PropTypes.array.isRequired,
    appdataTotal: PropTypes.number.isRequired,
    page: PropTypes.number,
    totalPage: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number,
    rowsPerPageOption: PropTypes.array,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    sortField: PropTypes.string,
    sortOrder: PropTypes.string,
    onRequestSort: PropTypes.func,
}

export default TableCustom