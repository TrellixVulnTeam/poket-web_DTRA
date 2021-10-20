import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { FinancialPlanningService } from 'src/app/finances/services/financial-planning.service';
import { WalletService } from 'src/app/finances/services/wallet.service';

@Component({
  selector: 'app-delete-financial-planning-modal',
  templateUrl: './delete-financial-planning-modal.component.html',
  styleUrls: ['./delete-financial-planning-modal.component.css']
})
export class DeleteFinancialPlanningModalComponent implements OnInit {

  @Input() id: any;
  @Input() planejamentoFinanceiro: any;
  @Input() valorAtual: any;
  @Input() valorObjetivado: any;
  @Input() dataFinal: any;
  @Input() tipoPF: any;
  @Input() idConta: any;
  @Input() conta: any;

  Wallet: any;

  constructor(
    public bsModalRef: BsModalRef,
    public fpService: FinancialPlanningService,
    public authService: AuthService,
    public walletService: WalletService
  ) { }

  ngOnInit(): void {
    this.listWallet()
  }

  listWallet() {
    this.walletService.getWalletList(this.authService.userData.uid).subscribe(res => {
      this.Wallet = res.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as unknown;
      })
    })
  }

  deleteFinancialPlanning() {
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

    console.warn(this.id, idWalletAntigo, valorDaContaAntigo, this.valorAtual)
// TODO vÊ se esse componente é usado
    // this.fpService.deleteFinancialPlanning(this.authService.userData.uid, this.id, idWalletAntigo, valorDaContaAntigo, this.valorAtual)
   
    // console.warn("id antigo: " +idWalletAntigo+ "|| conta antiga: " + contaAntiga + " || valor da conta antiga: " + valorDaContaAntigo + "valorRenda: " + this.valorRenda )

    this.closeModal()
  }

  closeModal() {
    this.bsModalRef.hide();
  }

}