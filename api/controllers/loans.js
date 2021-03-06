/* eslint-disable no-undef */
/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable class-methods-use-this */
import users from "../db/users";
import { loans, repayments } from "../db/loans";

class LoansController {
  getAllLoans(req, res) {
    res.json({
      status: 200,
      data: loans
    });
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * loan application
   */
  applyLoan(req, res) {
    const {
      email,
      createdOn,
      status,
      repaid,
      tenor,
      amount,
      installment,
      balance,
      interest
    } = req.body;
    const loanApplicant = users.find(_user => _user.userId === req.body.userId);

    const loan = [{}];
    loan.loanId = loans.id;
    loan.email = email;
    loan.createdOn = new Date();
    loan.status = status === "rejected" || "approved";
    loan.repaid = parseFloat(repaid);
    loan.tenor = parseFloat(tenor);
    loan.amount = parseFloat(amount);
    loan.installment = parseFloat(installment);
    loan.balance = parseFloat(balance);
    loan.interest = parseFloat(amount * 5) / 100;

    loan.push(loan);

    const resp = {
      status: 200,
      data: {
        loanId: loans.id,
        email: loans.email,
        createdOn: new Date(),
        status: loanApplicant.status,
        repaid: loans.repaid || true || false,
        tenor: parseFloat(loans.tenor),
        amount: parseFloat(loans.amount),
        installment: parseFloat(loans.installment),
        balance: parseFloat(loans.balance),
        interest: parseFloat(loans.interest)
      }
    };

    res.status(200).json(resp);
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * specific loan
   */

  singleLoan(req, res) {
    const loanDetails = loans.find(
      loan => loan.id === parseInt(req.params.id, 10)
    );
    if (!loanDetails) {
      return res.json({
        status: 404,
        error: "Loan application not found"
      });
    }
    res.json({
      status: 200,
      data: loanDetails
    });
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * unsettled loans
   */

  unSettledLoan(req, res) {
    const statusReq = req.query.status;
    const repaidReq = req.query.repaid;
    const info = loans.find(
      loan => loan.status === statusReq && loan.repaid === repaidReq
    );
    if (!info) {
      return res.json({
        status: 404,
        data: "Loan already settled"
      });
    }

    return res.json({
      status: 200,
      data: "Unsettled loan info",
      loans
    });
  }
  /**
   *
   * @param {*} req
   * @param {*} res
   * fully settled loans
   */
  fullySettledLoans(req, res) {
    const statusReq = req.query.status;
    const repaidReq = req.query.statusReq;
    const info = loans.find(
      loan => loan.status === statusReq && loan.repaid === repaidReq
    );
    if (!info) {
      return res.json({
        status: 404,
        data: "Loan not found"
      });
    }

    return res.json({
      status: 200,
      data: "loan fully settled",
      loans
    });
  }
  /**
   *
   * @param {*} res
   * @param {*} req
   * Loan repayment endpoint
   */
  loanRepayment(req, res) {
    const singleLoan = loans.find(
      loan => loan.id === parseInt(req.params.id, 10)
    );
    if (!singleLoan)
      return res.json({
        status: 404,
        error: "Loan not found"
      });
    const newRepayment = {
      id: repayments.length + 1,
      loanId: singleLoan.id,
      createdOn: new Date(),
      amount: singleLoan.amount,
      mothlyInstallment: singleLoan.paymentInstallment,
      paidAmount: req.body.paidAmount,
      balance: singleLoan.balance,
      userData: req.userData
    };
    repayments.push(newRepayment);
    res.json({
      status: 200,
      data: newRepayment
    });
  }

  /**
   *
   * @param {*} res
   * @param {*} req
   * Loan history endpoint
   */
  loanHistory(req, res) {
    const loanRepayment = [loans];

    const loanHistory = [];
    loanRepayment.forEach(loan => {
      if (loans.loanId === parseInt(req.params.id, 10)) {
        loanHistory.push(loans);
      }
    });
    res.json({
      status: 200,
      data: loanHistory
    });
  }
  /**
   *
   * @param {*} res
   * @param {*} req
   * Loan can be approved or rejected
   */
  loanStatus(req, res) {
    const { loanApplication } = req.params;

    let loanIndex = loans.find(
      loan => loan.loanApplication === loanApplication
    );
    if (loanIndex < 0) {
      return res.json({
        status: 403,
        data: "loan is not valid"
      });
    }
    loanIndex = req.body.status;
    res.json({
      status: 200,
      data: loanIndex
    });
  }
}
const loansController = new LoansController();
export default loansController;
