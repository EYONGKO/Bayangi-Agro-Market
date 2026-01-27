import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  AlertTitle,
  CircularProgress,
  Paper,
  Avatar,
} from '@mui/material';
import {
  Wallet as WalletIcon,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  History,
  Download,
  Upload,
  Settings,
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
} from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { theme } from '../theme/colors';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'purchase' | 'refund' | 'transfer';
  amount: number;
  description: string;
  date: Date;
  status: 'pending' | 'completed' | 'failed' | 'processing';
  reference?: string;
  recipient?: string;
  sender?: string;
}

interface PaymentMethod {
  id: string;
  type: 'mobile_money' | 'bank_card' | 'bank_account' | 'crypto';
  provider: string;
  last4?: string;
  isDefault: boolean;
  icon: string;
  color: string;
  available: boolean;
}

interface WalletStats {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  pendingTransactions: number;
  monthlyGrowth: number;
}

export default function WalletPage() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [walletData, setWalletData] = useState<{
    balance: number;
    transactions: Transaction[];
    paymentMethods: PaymentMethod[];
    stats: WalletStats;
  } | null>(null);
  const [showBalance, setShowBalance] = useState(true);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showSendMoney, setShowSendMoney] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'payment-methods'>('overview');

  // Load wallet data from localStorage
  useEffect(() => {
    const loadWalletData = () => {
      const walletKey = `wallet-${currentUser?.id || 'default'}`;
      const storedData = localStorage.getItem(walletKey);
      
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          setWalletData({
            balance: parsed.balance || 0,
            transactions: parsed.transactions || [],
            paymentMethods: parsed.paymentMethods || getDefaultPaymentMethods(),
            stats: calculateStats(parsed.transactions || [])
          });
        } catch (error) {
          console.error('Error loading wallet data:', error);
          setWalletData(getDefaultWalletData());
        }
      } else {
        setWalletData(getDefaultWalletData());
      }
    };

    loadWalletData();
  }, [currentUser]);

  const getDefaultPaymentMethods = (): PaymentMethod[] => [
    {
      id: '1',
      type: 'mobile_money',
      provider: 'MTN Mobile Money',
      last4: '6789',
      isDefault: true,
      icon: '📱',
      color: '#FFB300',
      available: true
    },
    {
      id: '2',
      type: 'mobile_money',
      provider: 'Orange Money',
      last4: '1234',
      isDefault: false,
      icon: '📱',
      color: '#FF6600',
      available: true
    },
    {
      id: '3',
      type: 'bank_card',
      provider: 'Visa',
      last4: '4242',
      isDefault: false,
      icon: '💳',
      color: theme.colors.neutral[600],
      available: false
    }
  ];

  const calculateStats = (transactions: Transaction[]): WalletStats => {
    const income = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const pending = transactions.filter(t => t.status === 'pending').length;
    
    // Calculate monthly growth (last 30 days vs previous 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    
    const recentIncome = transactions
      .filter(t => t.amount > 0 && new Date(t.date) >= thirtyDaysAgo)
      .reduce((sum, t) => sum + t.amount, 0);
    const previousIncome = transactions
      .filter(t => t.amount > 0 && new Date(t.date) >= sixtyDaysAgo && new Date(t.date) < thirtyDaysAgo)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyGrowth = previousIncome > 0 ? ((recentIncome - previousIncome) / previousIncome) * 100 : 0;
    
    return {
      balance: income - expenses,
      totalIncome: income,
      totalExpenses: expenses,
      pendingTransactions: pending,
      monthlyGrowth: Math.round(monthlyGrowth * 10) / 10
    };
  };

  const getDefaultWalletData = (): typeof walletData => ({
    balance: 0,
    transactions: [],
    paymentMethods: getDefaultPaymentMethods(),
    stats: calculateStats([])
  });

  const saveWalletData = (data: typeof walletData) => {
    if (!data) return;
    const walletKey = `wallet-${currentUser?.id || 'default'}`;
    localStorage.setItem(walletKey, JSON.stringify(data));
    setWalletData(data);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddFunds = async () => {
    // Show not available message immediately
    showToast({
      type: 'warning',
      title: 'Feature Not Available',
      message: 'Adding funds is currently not available. Please contact support for assistance.',
      duration: 6000
    });
    setShowAddFunds(false); // Close dialog immediately
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (amount > (walletData?.balance || 0)) {
      setError('Insufficient balance');
      return;
    }

    // Check if any payment method is available for withdrawal
    const availableMethods = walletData?.paymentMethods?.filter(method => method.available) || [];
    if (availableMethods.length === 0) {
      showToast({
        type: 'warning',
        title: 'Withdrawal Not Available',
        message: 'No payment methods are currently available for withdrawal. Please contact support to enable withdrawal.',
        duration: 6000
      });
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const defaultMethod = availableMethods.find(method => method.isDefault) || availableMethods[0];
      
      const newTransaction: Transaction = {
        id: `txn-${Date.now()}`,
        type: 'withdrawal',
        amount: -amount,
        description: `${defaultMethod.provider} Withdrawal`,
        date: new Date(),
        status: 'pending',
        reference: `${defaultMethod.provider.toUpperCase()}-${Date.now()}`
      };

      const updatedTransactions = [newTransaction, ...(walletData?.transactions || [])];
      const updatedStats = calculateStats(updatedTransactions);
      
      const updatedData = {
        balance: (walletData?.balance || 0) - amount,
        transactions: updatedTransactions,
        paymentMethods: walletData?.paymentMethods || getDefaultPaymentMethods(),
        stats: updatedStats
      };

      saveWalletData(updatedData);
      setWithdrawAmount('');
      setShowWithdraw(false);
      setSuccess(`Withdrawal request for ${formatCurrency(amount)} submitted via ${defaultMethod.provider}`);
      
      showToast({
        type: 'info',
        title: 'Withdrawal Request Submitted',
        message: `Your withdrawal request for ${formatCurrency(amount)} via ${defaultMethod.provider} has been submitted and is being processed.`,
        duration: 5000
      });
    } catch (err) {
      setError('Failed to process withdrawal. Please try again.');
      showToast({
        type: 'error',
        title: 'Withdrawal Failed',
        message: 'Unable to process your withdrawal request. Please try again later.',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMoney = async () => {
    const amount = parseFloat(sendAmount);
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (amount > (walletData?.balance || 0)) {
      setError('Insufficient balance');
      return;
    }

    if (!recipientEmail || !recipientEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newTransaction: Transaction = {
        id: `txn-${Date.now()}`,
        type: 'transfer',
        amount: -amount,
        description: `Transfer to ${recipientEmail}`,
        date: new Date(),
        status: 'completed',
        reference: `TRF-${Date.now()}`,
        recipient: recipientEmail
      };

      const updatedTransactions = [newTransaction, ...(walletData?.transactions || [])];
      const updatedStats = calculateStats(updatedTransactions);
      
      const updatedData = {
        balance: (walletData?.balance || 0) - amount,
        transactions: updatedTransactions,
        paymentMethods: walletData?.paymentMethods || getDefaultPaymentMethods(),
        stats: updatedStats
      };

      saveWalletData(updatedData);
      setSendAmount('');
      setRecipientEmail('');
      setShowSendMoney(false);
      setSuccess(`Successfully sent ${formatCurrency(amount)} to ${recipientEmail}`);
    } catch (err) {
      setError('Failed to send money. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft size={20} />;
      case 'withdrawal':
        return <ArrowUpRight size={20} />;
      case 'purchase':
        return <TrendingDown size={20} />;
      case 'refund':
        return <TrendingUp size={20} />;
      case 'transfer':
        return <ArrowUpRight size={20} />;
      default:
        return <WalletIcon size={20} />;
    }
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
      case 'refund':
        return '#4caf50';
      case 'withdrawal':
      case 'purchase':
      case 'transfer':
        return '#f44336';
      default:
        return theme.colors.neutral[600];
    }
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} />;
      case 'pending':
        return <Clock size={16} />;
      case 'processing':
        return <AlertCircle size={16} />;
      case 'failed':
        return <AlertCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  if (!walletData) {
    return (
      <PageLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: theme.colors.neutral[900] }}>
            My Wallet
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<History size={20} />}
              onClick={() => setActiveTab('transactions')}
              color={activeTab === 'transactions' ? 'primary' : 'inherit'}
            >
              Transactions
            </Button>
            <Button
              variant="outlined"
              startIcon={<CreditCard size={20} />}
              onClick={() => setActiveTab('payment-methods')}
              color={activeTab === 'payment-methods' ? 'primary' : 'inherit'}
            >
              Payment Methods
            </Button>
            <Button
              variant="outlined"
              startIcon={<Settings size={20} />}
              onClick={() => setActiveTab('overview')}
              color={activeTab === 'overview' ? 'primary' : 'inherit'}
            >
              Overview
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {activeTab === 'overview' && (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* Balance Card */}
            <Box sx={{ flex: 1, minWidth: { md: '60%' } }}>
              <Card sx={{ 
                background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`, 
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                        <WalletIcon size={24} />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, opacity: 0.9 }}>
                          Available Balance
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          {currentUser?.email}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton onClick={() => setShowBalance(!showBalance)} sx={{ color: 'white' }}>
                      {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </Box>
                  
                  <Typography variant="h3" sx={{ fontWeight: 900, mb: 3 }}>
                    {showBalance ? formatCurrency(walletData.balance) : '•••••••••'}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Plus size={20} />}
                      onClick={() => setShowAddFunds(true)}
                      sx={{ 
                        background: 'rgba(255, 255, 255, 0.2)',
                        '&:hover': { background: 'rgba(255, 255, 255, 0.3)' }
                      }}
                    >
                      Add Funds
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<ArrowUpRight size={20} />}
                      onClick={() => setShowWithdraw(true)}
                      sx={{ 
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        color: 'white',
                        '&:hover': { borderColor: 'rgba(255, 255, 255, 0.8)' }
                      }}
                    >
                      Withdraw
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<ArrowUpRight size={20} />}
                      onClick={() => setShowSendMoney(true)}
                      sx={{ 
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        color: 'white',
                        '&:hover': { borderColor: 'rgba(255, 255, 255, 0.8)' }
                      }}
                    >
                      Send Money
                    </Button>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Account Status
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Active
                      </Typography>
                    </Box>
                    <Chip
                      icon={<Shield size={16} />}
                      label="Verified"
                      color="success"
                      variant="filled"
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Stats Cards */}
            <Box sx={{ flex: 1, minWidth: { md: '40%' } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" sx={{ color: theme.colors.semantic.success }}>
                        Total Income
                      </Typography>
                      <Box sx={{ color: theme.colors.semantic.success }}>
                        <TrendingUp size={20} />
                      </Box>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {formatCurrency(walletData.stats.totalIncome)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.colors.neutral[600] }}>
                      +{walletData.stats.monthlyGrowth}% this month
                    </Typography>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" sx={{ color: theme.colors.semantic.error }}>
                        Total Expenses
                      </Typography>
                      <Box sx={{ color: theme.colors.semantic.error }}>
                        <TrendingDown size={20} />
                      </Box>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {formatCurrency(walletData.stats.totalExpenses)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.colors.neutral[600] }}>
                      {walletData.stats.pendingTransactions} pending
                    </Typography>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" sx={{ color: theme.colors.primary.main }}>
                        Pending
                      </Typography>
                      <Box sx={{ color: theme.colors.primary.main }}>
                        <Clock size={20} />
                      </Box>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {walletData.stats.pendingTransactions}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.colors.neutral[600] }}>
                      Transactions
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Box>
        )}

        {activeTab === 'transactions' && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Transaction History
                </Typography>
                <Button
                  startIcon={<Download size={16} />}
                  variant="outlined"
                  size="small"
                >
                  Export
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {walletData.transactions.map((transaction) => (
                  <Paper key={transaction.id} sx={{ p: 2, border: `1px solid ${theme.colors.neutral[200]}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: getTransactionColor(transaction.type) + '20',
                        color: 'white'
                      }}>
                        {getTransactionIcon(transaction.type)}
                      </Box>
                      
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {transaction.description}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getStatusIcon(transaction.status)}
                            <Chip
                              label={transaction.status}
                              size="small"
                              color={getStatusColor(transaction.status) as any}
                            />
                          </Box>
                        </Box>
                        <Typography variant="caption" sx={{ color: theme.colors.neutral[600] }}>
                          {transaction.date.toLocaleDateString()} • {transaction.reference}
                          {transaction.recipient && ` • To: ${transaction.recipient}`}
                        </Typography>
                      </Box>
                      
                      <Typography variant="h6" sx={{ fontWeight: 700, color: getTransactionColor(transaction.type) }}>
                        {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        {activeTab === 'payment-methods' && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Payment Methods
                </Typography>
                <Button
                  startIcon={<Plus size={16} />}
                  variant="contained"
                >
                  Add Payment Method
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {walletData.paymentMethods.map((method) => (
                  <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(33.333% - 11px)' } }} key={method.id}>
                    <Card sx={{ 
                      border: method.isDefault ? `2px solid ${theme.colors.primary.main}` : `1px solid ${theme.colors.neutral[200]}`,
                      position: 'relative',
                      '&:hover': {
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        transform: 'translateY(-2px)'
                      }
                    }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Avatar sx={{ bgcolor: method.color + '20', color: 'white' }}>
                            {method.icon}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {method.provider}
                            </Typography>
                            <Typography variant="body2" sx={{ color: theme.colors.neutral[600] }}>
                              {method.type === 'mobile_money' ? `•••• ${method.last4}` : `•••• ${method.last4}`}
                            </Typography>
                          </Box>
                          {method.isDefault && (
                            <Chip label="Default" size="small" color="primary" />
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Add Funds Dialog */}
        <Dialog open={showAddFunds} onClose={() => setShowAddFunds(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Funds to Wallet</DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mt: 2 }}>
              <AlertTitle>Feature Not Available</AlertTitle>
              Adding funds to your wallet is currently not available.
            </Alert>
            <Typography variant="body2" sx={{ mt: 2, color: theme.colors.neutral[600] }}>
              Please contact our support team if you need assistance with adding funds to your wallet.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: theme.colors.neutral[600] }}>
              • Email: eyongkomatchfire@gmail.com
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: theme.colors.neutral[600] }}>
              • Phone: +237 681 006 594
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAddFunds(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Withdraw Dialog */}
        <Dialog open={showWithdraw} onClose={() => setShowWithdraw(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Amount (FCFA)"
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              sx={{ mt: 2 }}
              helperText={`Available balance: ${formatCurrency(walletData.balance)}`}
            />
            <Typography variant="caption" sx={{ mt: 1, color: theme.colors.neutral[600] }}>
              Funds will be withdrawn to your default payment method
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowWithdraw(false)}>Cancel</Button>
            <Button 
              onClick={handleWithdraw} 
              variant="contained"
              disabled={loading || !withdrawAmount || parseFloat(withdrawAmount) > walletData.balance}
              startIcon={loading ? <CircularProgress size={20} /> : <Download size={20} />}
            >
              {loading ? 'Processing...' : 'Withdraw'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Send Money Dialog */}
        <Dialog open={showSendMoney} onClose={() => setShowSendMoney(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Send Money</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Amount (FCFA)"
              type="number"
              value={sendAmount}
              onChange={(e) => setSendAmount(e.target.value)}
              sx={{ mt: 2 }}
              helperText={`Available balance: ${formatCurrency(walletData.balance)}`}
            />
            <TextField
              fullWidth
              label="Recipient Email"
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              sx={{ mt: 2 }}
              helperText="Enter the recipient's email address"
            />
            <Typography variant="caption" sx={{ mt: 1, color: theme.colors.neutral[600] }}>
              Funds will be sent immediately to the recipient's wallet
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowSendMoney(false)}>Cancel</Button>
            <Button 
              onClick={handleSendMoney} 
              variant="contained"
              disabled={loading || !sendAmount || !recipientEmail || parseFloat(sendAmount) > walletData.balance}
              startIcon={loading ? <CircularProgress size={20} /> : <ArrowUpRight size={20} />}
            >
              {loading ? 'Processing...' : 'Send Money'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageLayout>
  );
}
