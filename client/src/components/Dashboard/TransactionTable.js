import React, { useState } from 'react';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import PaginationControls from './PaginationControls';
import DeleteConfirmationDialog from './DeleteConfirmDialog';
import TransactionRow from './TransactionRow';

const TransactionTable = ({ transactions, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/transactions/${id}`);
      onDelete(id);
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const confirmDelete = (id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <DeleteConfirmationDialog
            onConfirm={() => {
              handleDelete(id);
              onClose();
            }}
            onCancel={onClose}
          />
        );
      }
    });
  };

  return (
    <div className="container mx-auto">
      <div>
        <table className="w-full bg-white rounded-xl shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2 text-left">Type</th>
              <th className="border p-2 text-left">Category</th>
              <th className="border p-2 text-left">Amount</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map(transaction => (
              <TransactionRow key={transaction._id} transaction={transaction} onDelete={confirmDelete} />
            ))}
          </tbody>
        </table>
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      </div>
    </div>
  );
};

export default TransactionTable;