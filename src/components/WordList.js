import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

export default ({ words }) => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Word</TableCell>
        <TableCell>Definition</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>

      {Object.entries(words).map(([key, value]) => {
          return (
            <TableRow>
              <TableCell key={key}>{key}</TableCell>
              <TableCell>{value}</TableCell>
            </TableRow>
          )
      })}
    </TableBody>
  </Table>
)