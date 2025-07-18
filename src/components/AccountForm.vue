<template>
    <div class="accounts-root">
        <h2 class="accounts-title">Учетные записи</h2>
        <button class="add-btn" @click="addAccount" title="Добавить учётную запись">+</button>
        <div class="info-block">
            <img :src="questionIcon" alt="Вопрос" class="info-icon-img" />
            <span>
                Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;
            </span>
        </div>
        <div v-for="acc in accounts" :key="acc.id" class="account-row">
            <div class="fields-row">
                <div class="form-group">
                    <label>Метка</label>
                    <input :class="{ error: acc.errors?.labels }" type="text" v-model="labelsInput[acc.id]"
                        @blur="onBlurLabels(acc)" maxlength="50" placeholder="Метки через ;" />
                    <div v-if="acc.errors?.labels" class="error-row">
                        <span class="error-msg">{{ acc.errors.labels }}</span>
                    </div>
                </div>

                <div class="form-group">
                    <label>Тип записи</label>
                    <select v-model="acc.type" @change="onTypeChange(acc)">
                        <option value="LDAP">LDAP</option>
                        <option value="Локальная">Локальная</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Логин <span class="field-required">*</span></label>
                    <input :class="{ error: acc.errors?.login }" type="text" v-model="acc.login"
                        @blur="onBlurField(acc, 'login', acc.login)" maxlength="100" placeholder="Введите логин" />
                    <div v-if="acc.errors?.login" class="error-row">
                        <span class="error-msg">{{ acc.errors.login }}</span>
                    </div>
                </div>

                <div class="form-group" v-if="acc.type === 'Локальная'">
                    <label>Пароль <span class="field-required">*</span></label>
                    <input :class="{ error: acc.errors?.password }" type="password" v-model="acc.password"
                        @blur="onBlurField(acc, 'password', acc.password || '')" maxlength="100"
                        placeholder="Введите пароль" />
                    <div v-if="acc.errors?.password" class="error-row">
                        <span class="error-msg">{{ acc.errors.password }}</span>
                    </div>
                </div>

                <button class="remove-btn" title="Удалить" @click="removeAccount(acc.id)">
                    <img :src="recyclebinIcon" alt="Удалить" class="remove-icon-img" />
                </button>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useAccountStore, Account } from '../stores/accounts'
import { storeToRefs } from 'pinia'
import questionIcon from '../assets/question.png'
import recyclebinIcon from '../assets/recyclebin.png'


const store = useAccountStore()
const { accounts } = storeToRefs(store)
const labelsInput = reactive<Record<string, string>>({})



function addAccount() {
    store.addAccount()
}

function removeAccount(id: string) {
    store.removeAccount(id)
}

function onBlurLabels(acc: Account) {
    store.updateAccount(acc.id, 'labels', labelsInput[acc.id] || '')
    if (!store.validateAccount(acc)) store.save()
}

function onBlurField(acc: Account, field: string, value: string) {
    store.updateAccount(acc.id, field, value || '')
    if (!store.validateAccount(acc)) store.save()
}

function onTypeChange(acc: Account) {
    store.updateAccount(acc.id, 'type', acc.type)
    if (!store.validateAccount(acc)) store.save()
}

onMounted(() => {
    store.load()
    accounts.value.forEach(acc => {
        labelsInput[acc.id] = acc.labels.map(l => l.text).join('; ')
    })
})
</script>

<style scoped>
.accounts-root {
    max-width: 770px;
    margin: 40px auto;
    padding: 30px;
}

.accounts-title {
    display: inline-block;
}

.add-btn {
    margin-left: 20px;
    padding: 1px 8px;
    border: none;
    color: darkgray;
    border-radius: 4px;
    font-size: 1.5em;
    cursor: pointer;
}

.add-btn:hover {
    background: gray;
}

.info-block {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 20px 0;
    color: #40536c;
    background: #e9f0ff;
    padding: 10px 15px;
    border-radius: 5px;
}

.info-icon-img {
    width: 24px;
    height: 24px;
}

.account-row {
    border-bottom: 1px solid gray;
    margin-bottom: 10px;
    padding-bottom: 15px;
}

.fields-row {
    display: flex;
    align-items: flex-start;
    gap: 15px;
}



.form-group {
    min-height: 50px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 5px;
}



input[type="text"],
input[type="password"],
select {
    padding: 5px 10px;
    border-radius: 5px;
    border: 2px solid #cfdcff;
    outline: none;
    background: #f6f8fd;
}


input.error,
select.error {
    border-color: #e22 !important;
    background: #fff5f5;
}

.field-required {
    color: #e22;
}

.remove-btn {
    align-self: center;
    margin-bottom: 15px;
    border: none;
    border-radius: 5px;
}

.remove-icon-img {
    width: 22px;
    height: 22px;
}


.error-row {
    display: flex;
    gap: 20px;
}

.error-msg {
    color: #e22;
    font-size: 14px;
}
</style>
