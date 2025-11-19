const IntaSend = require('intasend-node');

const INTASEND_PUBLISHABLE_KEY = process.env.INTASEND_PUBLISHABLE_KEY || '';
const INTASEND_SECRET_KEY = process.env.INTASEND_SECRET_KEY || '';
const IS_TEST_MODE = process.env.INTASEND_TEST_MODE === 'true';

/**
 * Sanitize phone number to contain only digits
 * Removes +, spaces, dashes, and parentheses
 */
const sanitizePhoneNumber = (phone: string): string => {
  return phone.replace(/[\+\s\-\(\)]/g, '');
};

export interface ChargeParams {
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  amount: number;
  currency?: string;
  api_ref?: string;
  redirect_url?: string;
  host?: string;
}

export interface STKPushParams {
  first_name: string;
  last_name: string;
  email: string;
  host?: string;
  amount: number;
  phone_number: string;
  api_ref?: string;
  narrative?: string;
}

export interface PayoutParams {
  account: string;
  account_name: string;
  amount: number;
  narrative?: string;
  account_type?: 'MPESA' | 'BANK';
  bank_code?: string;
}

class IntaSendService {
  private intasend: any;

  constructor() {
    console.log('Initializing IntaSend with:');
    console.log('- Publishable Key:', INTASEND_PUBLISHABLE_KEY ? `${INTASEND_PUBLISHABLE_KEY.substring(0, 20)}...` : 'NOT SET');
    console.log('- Secret Key:', INTASEND_SECRET_KEY ? `${INTASEND_SECRET_KEY.substring(0, 20)}...` : 'NOT SET');
    console.log('- Test Mode:', IS_TEST_MODE);
    
    this.intasend = new IntaSend(
      INTASEND_PUBLISHABLE_KEY,
      INTASEND_SECRET_KEY,
      IS_TEST_MODE
    );
  }

  /**
   * Initiate a payment collection (Card/M-Pesa)
   */
  async initiateCharge(params: ChargeParams) {
    try {
      const collection = this.intasend.collection();
      const response = await collection.charge({
        first_name: params.first_name,
        last_name: params.last_name,
        email: params.email,
        phone_number: params.phone_number ? sanitizePhoneNumber(params.phone_number) : undefined,
        host: params.host || process.env.CLIENT_URL || 'https://harvestdirect.com',
        amount: params.amount,
        currency: params.currency || 'KES',
        api_ref: params.api_ref,
        redirect_url: params.redirect_url,
      });
      return response;
    } catch (error: any) {
      console.error('IntaSend charge error:', error);
      throw new Error(error.message || 'Payment initiation failed');
    }
  }

  /**
   * Initiate M-Pesa STK Push
   */
  async initiateMpesaSTKPush(params: STKPushParams) {
    try {
      // Sanitize phone number to remove +, spaces, dashes, etc.
      const sanitizedPhone = sanitizePhoneNumber(params.phone_number);
      
      console.log('Initiating M-Pesa STK Push with params:', {
        ...params,
        phone_number: sanitizedPhone ? `${sanitizedPhone.substring(0, 6)}...` : 'NOT SET'
      });
      
      const collection = this.intasend.collection();
      const response = await collection.mpesaStkPush({
        first_name: params.first_name,
        last_name: params.last_name,
        email: params.email,
        host: params.host || process.env.CLIENT_URL || 'https://harvestdirect.com',
        amount: params.amount,
        phone_number: sanitizedPhone,
        api_ref: params.api_ref,
      });
      
      console.log('M-Pesa STK Push response:', response);
      return response;
    } catch (error: any) {
      // Log full error for debugging
      console.error('M-Pesa STK Push full error:', JSON.stringify(error, null, 2));
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      
      // Parse buffer response if present
      let errorMessage = 'M-Pesa STK Push failed';
      if (error.response?.data) {
        const data = error.response.data;
        if (Buffer.isBuffer(data)) {
          try {
            const jsonStr = data.toString('utf8');
            const parsed = JSON.parse(jsonStr);
            console.error('M-Pesa STK Push error details:', parsed);
            if (parsed.errors && Array.isArray(parsed.errors)) {
              errorMessage = parsed.errors.map((e: any) => e.detail || e.code).join(', ');
            } else if (parsed.detail) {
              errorMessage = parsed.detail;
            }
          } catch (parseErr) {
            console.error('Failed to parse error response:', data.toString());
          }
        } else if (typeof data === 'object') {
          console.error('M-Pesa STK Push error details:', data);
          if (data.errors) {
            errorMessage = data.errors.map((e: any) => e.detail || e.code).join(', ');
          } else if (data.detail) {
            errorMessage = data.detail;
          }
        }
      }
      
      // Add HTTP status code to error message
      if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please check your IntaSend API keys.';
      }
      
      console.error('M-Pesa STK Push error:', error.message || errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(invoiceId: string) {
    try {
      const collection = this.intasend.collection();
      const response = await collection.status(invoiceId);
      return response;
    } catch (error: any) {
      console.error('Payment status check error:', error);
      throw new Error(error.message || 'Failed to check payment status');
    }
  }

  /**
   * Initiate a payout (send money)
   */
  async initiatePayout(params: PayoutParams) {
    try {
      const payouts = this.intasend.payouts();
      const response = await payouts.create({
        currency: 'KES',
        transactions: [
          {
            account: sanitizePhoneNumber(params.account),
            account_name: params.account_name,
            amount: params.amount,
            narrative: params.narrative || 'Payout',
            account_type: params.account_type || 'MPESA',
            bank_code: params.bank_code,
          },
        ],
      });
      return response;
    } catch (error: any) {
      console.error('Payout error:', error);
      throw new Error(error.message || 'Payout initiation failed');
    }
  }

  /**
   * Approve a payout
   */
  async approvePayout(payoutId: string) {
    try {
      const payouts = this.intasend.payouts();
      const response = await payouts.approve(payoutId);
      return response;
    } catch (error: any) {
      console.error('Payout approval error:', error);
      throw new Error(error.message || 'Payout approval failed');
    }
  }

  /**
   * Get wallet balance
   */
  async getWalletBalance() {
    try {
      const wallets = this.intasend.wallets();
      const response = await wallets.list();
      return response;
    } catch (error: any) {
      console.error('Wallet balance error:', error);
      throw new Error(error.message || 'Failed to fetch wallet balance');
    }
  }

  /**
   * Get wallet transactions
   */
  async getWalletTransactions(walletId: string) {
    try {
      const wallets = this.intasend.wallets();
      const response = await wallets.transactions(walletId);
      return response;
    } catch (error: any) {
      console.error('Wallet transactions error:', error);
      throw new Error(error.message || 'Failed to fetch wallet transactions');
    }
  }
}

export default new IntaSendService();
