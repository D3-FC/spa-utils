<template>
  <div class="demo-container">
    <div class="demo-container__item">
      <input
        type="text"
        v-model="form.data.name"
      >
      <div style="color: orangered">{{form.getError('name')}}</div>
      <button
        type="button"
        @click="form.submit()"
      >Submit
      </button>
      <div class="demo-container__footer">
        <pre v-text="form"/>
        <hr>
        Form Was Changed: {{form.wasChanged}}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import HoldableCommand from '../../modules/Command/HoldableCommand'
import { ValidationError } from '../../Error/ValidationError'
import { FormError } from '../../modules/Validation/FormError'
import ValidationErrorCollection from '../../modules/Validation/ValidationErrorCollection'
import Form from '../../modules/Form/Form'
import { UserTrans } from './UserTrans'
import { UserRepo } from './UserRepo'
import { LaravelApi } from '../../modules/Api/LaravelApi'
import { Api } from './Api'
import { User } from './User'
import { FormBuilder } from '../../modules/FormBuilder'

const mapError = (e: ValidationError) => {
  return new FormError({
    message: e.message,
    type: e.code,
    data: ValidationErrorCollection.createFromLaravelError(e.data || {})
  })
}

const builder = new FormBuilder(HoldableCommand, mapError)

@Component
export default class FormComponentDemo extends Vue {
  user = new User()
  form: Form<User> = new Form(
    new HoldableCommand(this.save),
    mapError,
    this.user
  )
    .enableAutoReset()

  formFromBuilder: Form<User> = builder.for(this.user).handle(this.save)

  userRepo = new UserRepo(
    new LaravelApi(new Api()),
    new UserTrans()
  )

  async save () {
    await this.userRepo.save(this.form.data)
  }

  log (...args: any) {
    console.log(...args)
  }
}
</script>

