import type { Accessor, Setter } from "solid-js"
import { createSignal, type JSXElement, Show } from "solid-js"
import { toBlob, toJpeg } from "html-to-image"
import { copyToClipboard, dateFormat, isMobile } from "~/utils"
import type { ChatMessage, Model } from "~/types"
import type { Setting } from "~/system"
import { clickOutside } from "~/hooks"

export default function SettingAction(props: {
  setting: Accessor<Setting>
  setSetting: Setter<Setting>
  clear: any
  messaages: ChatMessage[]
}) {
  const [shown, setShown] = createSignal(false)
  const [copied, setCopied] = createSignal(false)
  const [imgCopied, setIMGCopied] = createSignal(false)
  // tree shaking
  clickOutside
  return (
    <div
      class="text-sm text-slate-7 dark:text-slate my-2"
      use:clickOutside={() => setShown(false)}
    >
      <Show when={shown()}>
        <div class="<sm:max-h-10em max-h-14em overflow-y-auto">
          <SettingItem icon="i-ri:lock-password-line" label="网站密码">
            <input
              type="password"
              value={props.setting().password}
              class="max-w-150px ml-1em px-1 text-slate-7 dark:text-slate rounded-sm bg-slate bg-op-15 focus:bg-op-20 focus:ring-0 focus:outline-none"
              onInput={e => {
                props.setSetting({
                  ...props.setting(),
                  password: (e.target as HTMLInputElement).value
                })
              }}
            />
          </SettingItem>
          <SettingItem icon="i-carbon:api" label="OpenAI Key">
            <input
              type="password"
              value={props.setting().openaiAPIKey}
              class="max-w-150px ml-1em px-1 text-slate-7 dark:text-slate rounded-sm bg-slate bg-op-15 focus:bg-op-20 focus:ring-0 focus:outline-none"
              onInput={e => {
                props.setSetting({
                  ...props.setting(),
                  openaiAPIKey: (e.target as HTMLInputElement).value
                })
              }}
            />
          </SettingItem>
          <SettingItem
            icon="i-carbon:machine-learning-model"
            label="OpenAI 模型"
          >
            <select
              name="model"
              class="max-w-150px w-full bg-slate bg-op-15 rounded-sm appearance-none accent-slate text-center  focus:bg-op-20 focus:ring-0 focus:outline-none"
              value={props.setting().model}
              onChange={e => {
                props.setSetting({
                  ...props.setting(),
                  model: (e.target as HTMLSelectElement).value as Model
                })
              }}
            >
              <option value="gpt-3.5-turbo">gpt-3.5-turbo(4k)</option>
              <option value="gpt-4">gpt-4(8k)</option>
              <option value="gpt-4-32k">gpt-4(32k)</option>
            </select>
          </SettingItem>
          <SettingItem icon="i-carbon:user-online" label="系统角色指令">
           <select
              name="systemRule"
              class="text-ellipsis max-w-150px ml-1em px-1 text-slate-7 dark:text-slate rounded-sm bg-slate bg-op-15 focus:bg-op-20 focus:ring-0 focus:outline-none"
              value={props.setting().systemRule}
              onChange={e => {
                props.setSetting({
                  ...props.setting(),
                  systemRule: (e.target as HTMLInputElement).value as SystemRule
                })
              }}
             >
             <option value="">ChatGPT</option>
              <option value="来做角色扮演，你是跨境新秀Vincent，有6年的亚马逊从业经验，你擅长亚马逊运营和管理，也擅长运营量化与广告分析，你将用你专业的亚马逊经验帮助我解决问题，始终以该角色的身份和名义回答我的任何问题。">跨境新秀Vincent</option>
              <option value="You are an experienced Amazon customer service representative, please using your professional expertise to assist me in resolving customer issues and complaints encountered during their shopping experience on Amazon. Whether it's related to orders, payments, shipping, returns, or other aspects, you will provide detailed explanations and guidance based on the specific situation of the customer under my direction. Your response style is friendly, professional, and patient. After providing the solution, you will ask the customer if they need any further assistance or if they are satisfied with the feedback provided. You will always respond to my questions in the capacity and name of this role.The following is the customer message:">亚马逊客服Joey</option>
              <option value="你是一名资深的亚马逊产品开发经理Sasa，你将用你专业的产品开发经验协助我进行产品开发，你将根据我的需求提供数据分析、市场调研、竞品分析等报告。回答风格以，专业、客观、详细。当你为我提供反馈或建议时，会引导我进一步说明产品需求或意愿。始终以该角色的身份和名义回答我的任何问题。以下是我的第一个问题：">产品经理</option>
              <option value="I want you to act as a prompt engineer. You will help me write prompts for an AI art generator called Midjourney. I will provide you with short content ideas and your job is to elaborate these into full, explicit, coherent English prompts.
Prompts involve describing content and style of images in concise accurate English language. It is useful to be explicit and use references to popular culture, artists and mediums. Your focus needs to be on nouns and adjectives. I will give you some example prompts for your reference. Please define the exact camera that should be used.
Here is a formula for you to use: content insert nouns here, medium: insert artistic medium here, style: insert references to genres, artists and popular culture here, lighting: reference the lighting here, colours: reference colour styles and palettes here, composition: reference cameras, specific lense. shot types and positional elements here
When giving a prompt, speak in natural language and be more specific, use precise, articulate language. Always output me two full prompt options that are different. You will always respond to my questions in the capacity and name of this role.The following is the first:">Midjourney大师</option>             
             </select>
          </SettingItem>
          <SettingItem icon="i-carbon:data-enrichment" label="思维发散程度">
            <input
              type="range"
              min={0}
              max={100}
              value={String(props.setting().openaiAPITemperature)}
              class="max-w-150px w-full h-2 bg-slate bg-op-15 rounded-lg appearance-none cursor-pointer accent-slate"
              onInput={e => {
                props.setSetting({
                  ...props.setting(),
                  openaiAPITemperature: Number(
                    (e.target as HTMLInputElement).value
                  )
                })
              }}
            />
          </SettingItem>
          <SettingItem
            icon="i-carbon:save-image"
            label="记录对话内容，刷新不会消失"
          >
            <label class="relative inline-flex items-center cursor-pointer ml-1">
              <input
                type="checkbox"
                checked={props.setting().archiveSession}
                class="sr-only peer"
                onChange={e => {
                  props.setSetting({
                    ...props.setting(),
                    archiveSession: (e.target as HTMLInputElement).checked
                  })
                }}
              />
              <div class="w-9 h-5 bg-slate bg-op-15 peer-focus:outline-none peer-focus:ring-0  rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate"></div>
            </label>
          </SettingItem>
          <SettingItem
            icon="i-carbon:3d-curve-auto-colon"
            label="开启连续对话，将加倍消耗 Token"
          >
            <label class="relative inline-flex items-center cursor-pointer ml-1">
              <input
                type="checkbox"
                checked={props.setting().continuousDialogue}
                class="sr-only peer"
                onChange={e => {
                  props.setSetting({
                    ...props.setting(),
                    continuousDialogue: (e.target as HTMLInputElement).checked
                  })
                }}
              />
              <div class="w-9 h-5 bg-slate bg-op-15 peer-focus:outline-none peer-focus:ring-0  rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate"></div>
            </label>
          </SettingItem>
        </div>
        <hr class="my-1 bg-slate-5 bg-op-15 border-none h-1px"></hr>
      </Show>
      <div class="flex items-center justify-between">
        <ActionItem
          onClick={() => {
            setShown(!shown())
          }}
          icon="i-carbon:settings"
          label="设置"
        />
        <div class="flex">
          <ActionItem
            onClick={async () => {
              await exportJpg()
              setIMGCopied(true)
              setTimeout(() => setIMGCopied(false), 1000)
            }}
            icon={
              imgCopied()
                ? "i-ri:check-fill dark:text-yellow text-yellow-6"
                : "i-carbon:image"
            }
            label="导出图片"
          />
          <ActionItem
            label="导出 Markdown"
            onClick={async () => {
              await exportMD(props.messaages)
              setCopied(true)
              setTimeout(() => setCopied(false), 1000)
            }}
            icon={
              copied()
                ? "i-ri:check-fill dark:text-yellow text-yellow-6"
                : "i-ri:markdown-line"
            }
          />
          <ActionItem
            onClick={props.clear}
            icon="i-carbon:trash-can"
            label="清空对话"
          />
        </div>
      </div>
    </div>
  )
}

function SettingItem(props: {
  children: JSXElement
  icon: string
  label: string
}) {
  return (
    <div class="flex items-center p-1 justify-between hover:bg-slate hover:bg-op-10 rounded">
      <div class="flex items-center">
        <button class={props.icon} />
        <span ml-1>{props.label}</span>
      </div>
      {props.children}
    </div>
  )
}

function ActionItem(props: { onClick: any; icon: string; label?: string }) {
  return (
    <div
      class="flex items-center cursor-pointer mx-1 p-2 hover:bg-slate hover:bg-op-10 rounded text-1.2em"
      onClick={props.onClick}
    >
      <button class={props.icon} title={props.label} />
    </div>
  )
}

async function exportJpg() {
  const messageContainer = document.querySelector(
    "#message-container"
  ) as HTMLElement
  async function downloadIMG() {
    const url = await toJpeg(messageContainer)
    const a = document.createElement("a")
    a.href = url
    a.download = `ChatGPT-${dateFormat(new Date(), "HH-MM-SS")}.jpg`
    a.click()
  }
  if (!isMobile() && navigator.clipboard) {
    try {
      const blob = await toBlob(messageContainer)
      blob &&
        (await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]))
    } catch (e) {
      await downloadIMG()
    }
  } else {
    await downloadIMG()
  }
}

async function exportMD(messages: ChatMessage[]) {
  const role = {
    system: "系统",
    user: "我",
    assistant: "ChatGPT",
    error: "错误"
  }
  await copyToClipboard(
    messages
      .map(k => {
        return `### ${role[k.role]}\n\n${k.content.trim()}`
      })
      .join("\n\n\n\n")
  )
}
