import React, { useState, useEffect, useMemo } from "react";
import { styled } from '@mui/material/styles';
import PropTypes from "prop-types";
import { tableCellClasses } from '@mui/material/TableCell';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    Typography,
    Select,
    MenuItem,
    Stack,
    IconButton
} from "@mui/material";
import Icon from '@mdi/react';
import {
    mdiMenuSwap,
    mdiMenuUp,
    mdiMenuDown,
} from '@mdi/js';
import {
    ArrowDownwardIcon,
    ArrowUpwardIcon,
    FirstPageOutlinedIcon,
    LastPageOutlinedIcon,
    NavigateBeforeOutlinedIcon,
    NavigateNextOutlinedIcon,
    UnfoldMoreIcon,

} from "../../assets/Icon/muiIcon";
import { useTheme } from "@mui/material/styles";

// Pindahkan StyledTableCell ke luar komponen agar tidak dibuat ulang setiap render
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        borderBottom: "1px solid",
        borderColor: theme.palette.table.border,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        padding: '7px',
        color: theme.palette.text.primary,
    },
    [`&.${tableCellClasses.body}`]: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        padding: '7px',
        color: theme.palette.text.primary,
    },
}));

const TableCustom = (props) => {
    const theme = useTheme();

    const [page, setPage] = useState(props.page || 0) // state ini 0-based
    const [rowsPerPage, setRowsPerPage] = useState(props.rowsPerPage || 10)
    const [sortField, setSortField] = useState(props.sortField || '');
    const [sortOrder, setSortOrder] = useState(props.sortOrder || 'asc');

    useEffect(() => {
        setPage(props.page || 0)
    }, [props.page])

    useEffect(() => {
        setRowsPerPage(props.rowsPerPage || 10)
    }, [props.rowsPerPage])

    useEffect(() => {
        setSortField(props.sortField || '');
        setSortOrder(props.sortOrder || 'asc');
    }, [props.sortField, props.sortOrder])

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
        if (props.onPageChange) {
            props.onPageChange(newPage)
        }
    }

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10)
        setRowsPerPage(newRowsPerPage)
        if (props.onRowsPerPageChange) {
            props.onRowsPerPageChange(newRowsPerPage)
        }
    }

    const handleRequestSort = (event, property) => {
        const isAsc = sortField === property && sortOrder === 'asc';
        const newSortOrder = isAsc ? 'desc' : 'asc';
        setSortField(property);
        setSortOrder(newSortOrder);
        if (props.onRequestSort) {
            props.onRequestSort(property, newSortOrder);
        }
    };

    const calculateRange = () => {
        const from = props.appdataTotal === 0 ? 0 : (page * rowsPerPage) + 1;
        const to = Math.min((page * rowsPerPage) + rowsPerPage, props.appdataTotal);
        return { from, to };
    };

    const { from, to } = calculateRange();

    const totalPages = props.totalPage || 1;

    // --- LOGIKA PAGINATION KUSTOM UNTUK MENAMPILKAN 3 HALAMAN ---
    // Konversi ke 1-based untuk perhitungan yang lebih mudah
    const currentPage = page + 1;
    const pageNumbers = useMemo(() => {
        const maxVisiblePages = 3;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = startPage + maxVisiblePages - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        const numbers = [];
        for (let i = startPage; i <= endPage; i++) {
            numbers.push(i);
        }
        return numbers;
    }, [currentPage, totalPages]);
    // --- AKHIR LOGIKA PAGINATION KUSTOM ---

    // Optimasi render header columns dengan useMemo
    const headerColumns = useMemo(() => {
        return props.columns.map((column) => (
            <StyledTableCell
                key={column.dataField}
                align={"center"}
                sx={{ minWidth: column.minWidth || 'auto' }}
            >
                {column.sort ? (
                    <Box display={"flex"} alignItems={"center"} justifyContent={column.headerAlign ? column.headerAlign : "center"}
                        onClick={() => handleRequestSort(null, column.dataField)}
                        sx={{ cursor: 'pointer' }}
                        gap={1}
                    >
                        <Typography variant="body1" fontWeight="medium">
                            {column.text}
                        </Typography>

                        {/* Icon Sort Section */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            {sortField === column.dataField ? (
                                sortOrder === 'asc' ? (
                                    <ArrowUpwardIcon sx={{ fontSize: '14px' }} />
                                ) : (
                                    <ArrowDownwardIcon sx={{ fontSize: '14px' }} />
                                )
                            ) : (
                                <UnfoldMoreIcon sx={{ fontSize: '14px' }} />
                            )}
                        </Box>
                    </Box>
                ) : (
                    <Box
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}
                    >
                        <Typography variant="body1" fontWeight="medium" >
                            {column.text}
                        </Typography>
                    </Box>
                )}
            </StyledTableCell>
        ));
    }, [props.columns, sortField, sortOrder]);

    // Optimasi render body rows dengan useMemo
    const bodyRows = useMemo(() => {
        if (props.appdata.length === 0 && !props.loadingData) {
            return (
                <TableRow>
                    <StyledTableCell colSpan={props.columns.length} align="center">
                        <Typography variant="body1"> No records to display</Typography>
                    </StyledTableCell>
                </TableRow>
            );
        }

        return props.appdata.map((row) => (
            <TableRow
                hover
                role="checkbox"
                tabIndex={-1}
                key={row[props.keyField]}
                sx={{
                    "&:hover": {
                        backgroundColor: theme.palette.table.hover,
                    },
                    "&:nth-of-type(even)": {
                        backgroundColor: theme.palette.table.striped,
                    }
                }}
            >
                {props.columns.map((column) => {
                    const value = row[column.dataField];
                    return (
                        <StyledTableCell
                            key={column.dataField}
                            align={column.bodyAlign || 'left'}
                            sx={{
                                minWidth: column.minWidth || 'auto',
                                padding: { xs: '8px 12px', sm: '8px 12px', md: '8px 16px' },
                            }}
                            size="small"
                        >
                            {column.formatter ? column.formatter(value, row) : value}
                        </StyledTableCell>
                    );
                })}
            </TableRow>
        ));
    }, [props.appdata, props.columns, props.keyField, props.loadingData, theme]);

    const paginationButtonSx = {
        borderRadius: '8px',
        border: '1px solid',
        borderColor: 'divider',
        color: 'text.secondary',
        backgroundColor: 'background.paper',
        transition: 'all 0.2s ease',
        width: { xs: 26, sm: 26, md: 30 },
        height: { xs: 26, sm: 26, md: 30 },
        '&:hover:not(.Mui-disabled)': {
            backgroundColor: 'action.hover',
            borderColor: 'primary.main',
            color: 'primary.main',
        },
        '&.Mui-disabled': {
            borderColor: 'action.disabledBackground',
            color: 'action.disabled',
            backgroundColor: 'action.disabledBackground',
        }
    };

    return (
        <>
            <TableContainer
                sx={{
                    borderRadius: '10px',
                    border: '1px solid',
                    borderColor: theme.palette.table.border,
                    position: 'relative',
                    overflowX: 'auto',
                }}
            >
                <Table
                    size="small"
                    aria-label="a dense table"
                    width="100%"
                    sx={{
                        border: 'none',
                        tableLayout: 'auto',
                        width: 'max-content',
                        minWidth: '100%'
                    }}
                >
                    <TableHead
                        sx={{
                            bgcolor: theme.palette.table.headerBackground,
                            position: 'sticky',
                            top: 0,
                            zIndex: 1,
                        }}
                    >
                        <TableRow>
                            {headerColumns}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {bodyRows}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* FOOTER SECTION */}
            <Stack direction={{ sm: 'column', md: 'row' }} justifyContent={{ xs: 'center', md: 'space-between' }} mt={2} spacing={1} alignItems={"center"}>
                <Typography variant="body1">Showing {from} to {to} of {props.appdataTotal} entries</Typography>

                {/* PAGINATION KUSTOM DENGAN ELLIPSIS */}
                <Stack direction="row" spacing={1} alignItems="center">
                    {/* Tombol First Page */}
                    <IconButton
                        onClick={(e) => handleChangePage(e, 0)}
                        disabled={page === 0}
                        sx={paginationButtonSx}
                    >
                        <FirstPageOutlinedIcon fontSize="small" />
                    </IconButton>

                    {/* Tombol Sebelumnya */}
                    <IconButton
                        onClick={(e) => handleChangePage(e, page - 1)}
                        disabled={page === 0}
                        sx={paginationButtonSx}
                    >
                        <NavigateBeforeOutlinedIcon fontSize="small" />
                    </IconButton>

                    {/* Tombol Nomor Halaman */}
                    {pageNumbers.map((p) => (
                        <IconButton
                            key={p}
                            onClick={(e) => handleChangePage(e, p - 1)}
                            sx={{
                                borderRadius: '10px',
                                border: '1px solid',
                                borderColor: p === currentPage ? 'primary.main' : 'divider',
                                color: p === currentPage ? 'text.light' : 'text.secondary',
                                backgroundColor: p === currentPage ? 'primary.main' : 'background.paper',
                                fontWeight: p === currentPage ? "medium" : "normal",
                                transition: 'all 0.2s ease',
                                width: { xs: 28, sm: 28, md: 36 },
                                height: { xs: 28, sm: 28, md: 36 },
                                typography: 'body1',
                                '&:hover': {
                                    backgroundColor: p === currentPage ? 'primary.dark' : 'action.hover',
                                    borderColor: 'primary.main',
                                    color: p === currentPage ? 'text.light' : 'primary.main',
                                },
                            }}
                        >
                            {p}
                        </IconButton>
                    ))}

                    {/* --- PERUBAHAN: TAMBAHKAN ELLIPSIS SECARA KONDISIONAL --- */}
                    {/* Tampilkan elipsis jika halaman terakhir yang terlihat bukanlah halaman terakhir total */}
                    {pageNumbers.length > 0 && pageNumbers[pageNumbers.length - 1] < totalPages && (
                        <Typography
                            variant="body1"
                            sx={{
                                px: 1, // Beri sedikit padding horizontal
                                color: 'text.secondary',
                                userSelect: 'none', // Cegah teks dipilih
                                alignSelf: 'center' // Ratakan tengah secara vertikal dengan tombol
                            }}
                        >
                            ...
                        </Typography>
                    )}

                    {/* Tombol Selanjutnya */}
                    <IconButton
                        onClick={(e) => handleChangePage(e, page + 1)}
                        disabled={page === totalPages - 1}
                        sx={paginationButtonSx}
                    >
                        <NavigateNextOutlinedIcon fontSize="small" />
                    </IconButton>

                    {/* Tombol Last Page */}
                    <IconButton onClick={(e) => handleChangePage(e, totalPages - 1)} disabled={page === totalPages - 1} sx={paginationButtonSx} >
                        <LastPageOutlinedIcon fontSize="small" />
                    </IconButton>
                </Stack>

                {/* Show entries selector */}
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    order: 3,
                    justifyContent: 'center'
                }}>
                    <Typography variant="body1">Show</Typography>
                    <Select
                        size="small"
                        value={rowsPerPage}
                        onChange={handleChangeRowsPerPage}
                        sx={{
                            height: { xs: 28, sm: 28, md: 32 },
                            minWidth: { xs: 50, sm: 50, md: 60 },
                            '& .MuiSelect-select': {
                                padding: { xs: '2px 8px', sm: '2px 8px', md: '4px 10px' },
                                minHeight: 'auto',
                            }
                        }}
                    >
                        {props.rowsPerPageOption.map((opt) => (
                            <MenuItem key={opt} value={opt} >
                                {opt}
                            </MenuItem>
                        ))}
                    </Select>
                    <Typography variant="bodd1">entries</Typography>
                </Box>
            </Stack>
        </>
    );
};

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
};

export default TableCustom;