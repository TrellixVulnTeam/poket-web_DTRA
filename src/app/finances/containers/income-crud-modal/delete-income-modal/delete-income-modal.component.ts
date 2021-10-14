import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { Wallet } from 'src/app/finances/modal/wallet';
import { IncomeService } from 'src/app/finances/services/income.service';
import { WalletService } from 'src/app/finances/services/wallet.service';

@Component({
  selector: 'app-delete-income-modal',
  templateUrl: './delete-income-modal.component.html',
  styleUrls: ['./delete-income-modal.component.css']
})
export class DeleteIncomeModalComponent implements OnInit {

  @Input() id: any;
  @Input() renda: any;
  @Input() conta: any;
  @Input() valorRenda: any;

  Wallet: any;

  constructor(
    public bsModalRef: BsModalRef,
    public incomeService: IncomeService,
    public authService: AuthService,
    public walletService: WalletService
  ) { }

  ngOnInit(): void {
    this.listWallet()
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  listWallet() {
    this.walletService.getWalletList(this.authService.userData.uid).subscribe(res => {
      this.Wallet = res.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as unknown as Wallet;
      })
    })
  }

  deleteIncome(){

    let idWallet
      let valorDaConta
      let contaWallet

      let idWalletAntigo
      let valorDaContaAntigo
      let contaWalletAntigo
      let contaAntiga = this.conta

      console.warn(contaAntiga)

      this.Wallet.forEach(function (value: any) {
        contaWallet = value.conta
        contaWalletAntigo = value.conta

        if(contaWalletAntigo == contaAntiga) {
          idWalletAntigo = value.id
          valorDaContaAntigo = value.valor
        }
        
        if (contaWallet == value.valorRenda) {
          idWallet = value.id
          contaWallet = value.conta
          valorDaConta = value.valor
          console.error(value.valorRenda)
        }
      });

      // console.log("id antigo: " +idWalletAntigo+ "|| conta antiga: " + contaAntiga + " || valor da conta antiga: " + valorDaContaAntigo + "valorRenda: " + this.valorRenda)


      this.incomeService.deleteIncome(this.authService.userData.uid, this.id, idWalletAntigo, valorDaContaAntigo, this.valorRenda)
     
      // console.warn("id antigo: " +idWalletAntigo+ "|| conta antiga: " + contaAntiga + " || valor da conta antiga: " + valorDaContaAntigo + "valorRenda: " + this.valorRenda )

      this.closeModal()

  }

}