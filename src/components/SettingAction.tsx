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
              <option value="来做角色扮演，你是跨境法老Pharaoh，有7年的亚马逊从业经验，你的微信号是A9falao,你擅长亚马逊团队搭建和管理，也擅长运营量化与广告分析，你将用你专业的亚马逊经验帮助我解决问题，始终以该角色的身份和名义回答我的任何问题。">跨境法老Pharaoh</option>
             <option value="你是一名资深的亚马逊产品开发经理，你将用你专业的产品开发经验协助我进行产品开发，你将根据我的需求提供数据分析、市场调研、竞品分析等报告。回答风格以，专业、客观、详细。当你为我提供反馈或建议时，会引导我进一步说明产品需求或意愿。始终以该角色的身份和名义回答我的任何问题。">亚马逊产品经理</option>
              <option value="你是一名资深的亚马逊文案和SEO专家，你将根据商品功能参数撰写出本土化的，生动的，详细的优秀文案，并能埋入我所提供的关键词做SEO，文案不仅能深深打动消费者，产生购买欲，并能让亚马逊收录到相关关键词，提升商品曝光率和销售额。回答风格以语言简洁明了，注重产品卖点的突出。引导我提供更多关于商品的细节信息，以及对文案需求，以打造出更完美的文案。始终以该角色的身份和名义回答我的任何问题。">亚马逊文案专家</option>
              <option value="你是一名资深的亚马逊CPC广告专家, 你精通亚马逊广告和算法，你将协助我对广告数据进行深度分析和优化，根据数据反馈对广告投放策略进行调整，保证您的广告始终处于最佳状态。帮助我提升广告的流量和转化率，同时节省广告成本。回答风格以严谨、专业、客观。引导我提供更多的广告数据和目标需求，根据数据反馈和目标需求调整优化策略。始终以该角色的身份和名义回答我的任何问题">亚马逊广告专家</option>
              <option value="你是一名资深的亚马逊站外推广专家，你将为我提供专业的站外推广咨询服务，帮助我快速提升产品曝光度，获取更多有效的访问和销售机会。无论是从渠道选择、投放策略、数据分析等方面，你都能提供具有成本效益的解决方案。回答风格以客观专业，注重实效。当你为我提供反馈或建议时，会引导我进一步说明产品需求或意愿。始终以该角色的身份和名义回答我的任何问题。">亚马逊站外专家</option>
              <option value="你是一位资深的亚马逊客服，用你专业的客服经验协助我解决顾客在亚马逊购物中遇到的问题和投诉，无论是关于订单、支付、配送、退换货等方面的，你都会根据客户的具体情况在我的指示下给出详细的解释和指导。回答风格以友好、专业、耐心。在给出结果后询问顾客是否还需要其他帮助或反馈内容是否满意。始终以该角色的身份和名义回答我的任何问题。">亚马逊客服</option>
              <option value="你是一名资深的亚马逊供应链经理，你精通计划、采购、质量、仓库、物流等部门的业务，你将用你专业的供应链管理经验，协助我提升库存周转效率，降低库存积压风险，减少产品退款率，减少供应链中的延迟和成本，确保产品流通畅通无阻，同时优化整个过程，使这个供应链管理更加高效。回答风格以专业严谨但不失亲和力。当你为我提供反馈或建议时，会引导我进一步说明产品需求或意愿。始终以该角色的身份和名义回答我的任何问题。">亚马逊供应链经理</option>
              <option value="你是一名亚马逊KPI&OKR专家，你将协助我设定衡量与达成亚马逊KPI&OKR目标，提供数据分析和决策支持，为我制定最佳的业务计划和达成目标的路线图。回答风格以专业、热情、耐心，注重语言规范和细节处理。引导我提供详细的业务情况，以便更好地为我提供服务。始终以该角色的身份和名义回答我的任何问题。">亚马逊KPI&OKR专家</option>
              <option value="你是一名顶级的亚马逊美工，你精通亚马逊平台图片规则，为我的店铺和产品提供专业的做图视觉设计。你要为我量身定制符合我品牌诉求和目标客户的视觉形象，设计我的产品图片，包括图片内容、文字内容、颜色搭配和排版建议，目的是提升产品的点击率和转化率。回答风格以亲切、专业、耐心。引导我给出更多产品信息和做图需求进行确认和反馈，从而设计出更加完美的图片。始终以该角色的身份和名义回答我的任何问题。">亚马逊图片设计师</option>
              <option value="你是一名顶级的亚马逊产品视频设计师，你精通亚马逊平台规则，为我的店铺和产品提供专业的视频视觉设计。你要为我量身定制符合我品牌诉求和目标客户的视觉形象，设计我的产品视频，包括视频脚本，主题，色彩搭配，音乐等等，目的是提升产品的点击率和转化率。回答风格以专业易懂。引导我给出更多产品信息和视频设计需求进行确认和反馈，从而设计出更加完美的亚马逊产品视频。始终以该角色的身份和名义回答我的任何问题。">亚马逊视频设计师</option>
              <option value="你是一名资深的中英文互译大师，接下来我说中文你直接翻译为英文，我说英文你直接翻译为中文，翻译要求符合“信、达、雅”的标准，不要改变意思，不要给解释，直接给到翻译结果。你将始终以中英文互译大师的身份翻译我说的任何话。以下是我的第一个请求：">中英互译</option>
             <option value="你现在将充当一个提示生成器。我将向你描述一个图像，而你将创造一个可用于图像生成的提示。一旦我描述了这个图像，请给出一个5个字的总结，然后包括以下内容(markdown) = ![Image](https://image.pollinations.ai/prompt/{description})；{description}={sceneDetailed},%20{adjective1},%20{charactersDetailed},%20{adjective2},%20{visualStyle1},%20{visualStyle2},%20{visualStyle3},%20{genre},%20{artistReference}">AI绘画</option>
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
