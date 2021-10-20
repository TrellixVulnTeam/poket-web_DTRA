import { FnParam } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { FinancialPlanning } from 'src/app/finances/modal/financial-planning';
import { Wallet } from 'src/app/finances/modal/wallet';
import { FinancialPlanningService } from 'src/app/finances/services/financial-planning.service';
import { WalletService } from 'src/app/finances/services/wallet.service';
import { AlertModalService } from 'src/app/shared/services/alert-modal.service';

@Component({
  selector: 'app-create-financial-planning-modal',
  templateUrl: './create-financial-planning-modal.component.html',
  styleUrls: ['./create-financial-planning-modal.component.css']
})
export class CreateFinancialPlanningModalComponent implements OnInit {
  public financialPlanningRegister: FormGroup;
  Wallet: any;

  constructor(
    public bsModalRef: BsModalRef,
    public fpService: FinancialPlanningService,
    public authService: AuthService,
    public formBuilder: FormBuilder,
    private alertService: AlertModalService,
    public walletService: WalletService,
  ) { 
    this.financialPlanningRegister = this.formBuilder.group({
      planejamentoFinanceiro: ["", Validators.maxLength(30)],
      tipoPF: [""],
      conta: [""],
      valorAtual: ["", Validators.maxLength(8)],
      valorObjetivado: ["", Validators.maxLength(8)],
      dataInicial: [""],
      dataFinal: [""],
      idConta: [""],
      contaValor: [""]

    })
  }

  ngOnInit(): void {
    this.listWallet()
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

  addFinancialPlanning() {
    const nomePF = this.financialPlanningRegister.get('planejamentoFinanceiro')
    const tipoPF = this.financialPlanningRegister.get('tipoPF')
    const conta = this.financialPlanningRegister.get('conta')
    const valorAtualPF = this.financialPlanningRegister.get('valorAtual')
    const valorObjetivadoPF = this.financialPlanningRegister.get('valorObjetivado')
    const dataInicialPF = this.financialPlanningRegister.get('dataInicial')
    const dataFinalPF = this.financialPlanningRegister.get('dataFinal')
    const idConta = this.financialPlanningRegister.get('idConta')
    const contaValor = this.financialPlanningRegister.get('contaValor')

    if (nomePF?.value == "" || valorAtualPF?.value == "" || valorObjetivadoPF?.value == "" || dataFinalPF?.value == "" || tipoPF?.value == "" || conta?.value == "") {
      this.alertService.showAlertDanger("Falta campos para preencher");

    } else {
      let contaWallet

      this.Wallet.forEach(function (value: any) {
        contaWallet = value.conta
        if (contaWallet == conta?.value) {

          idConta?.setValue(value.id)
          contaValor?.setValue(value.valor)

          let dataAtual = new Date();
          let fullYeah = dataAtual.getFullYear();
          let month = dataAtual.getMonth();
          let day = dataAtual.getDate();
          let fullDate = fullYeah +'-'+ (month+1) + '-' + day;
          dataInicialPF?.setValue(fullDate) 

        }

      });

      // Criar planejamento e Atualizar a conta que foi salva a renda
      this.fpService.createFinancialPlanning(this.financialPlanningRegister.value, this.authService.userData.uid)


      this.closeModal()


    }
  }

  closeModal() {
    this.bsModalRef.hide();
  }

}