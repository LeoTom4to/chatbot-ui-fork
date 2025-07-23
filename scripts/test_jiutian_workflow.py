import requests
import json

# 🔐 九天接口配置
API_URL = 'https://jiutian.10086.cn/largemodel/api/v1/workflow/run'
JWT_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcGlfa2V5IjoiNjg3NDViZDZiMzgxYWM0MDdkOGZkZDFjIiwiZXhwIjoxNzUyNzE4MDM1LCJ0aW1lc3RhbXAiOjE3NTI2NTgwMzV9.Je4MXaywDLid3kng6zDifEMa6PGAHpcRXnunQD_dbJk'
WORKFLOW_ID = '68763c505dea55668ad32dbc'

# 🧠 模拟用户输入和历史记录
user_input_text = "您好，您在XX平台购买的商品存在质量问题，需要为您办理退款，请点击链接：https://xxx"
chat_history = [
    ["你是谁", "我是反诈智能助手"],
    ["你能做什么", "我可以识别诈骗短信"]
]

# 📤 请求体
payload = {
    "id": WORKFLOW_ID,
    "type": 1,
    "input": {
        "BOT_CHAT_HISTORY": None,             # 可换为 chat_history
        "BOT_USER_INPUT": user_input_text,    # 用户输入
        "BOT_USER_FILE": None                 # 暂不使用
    },
    "history": chat_history
}

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {JWT_TOKEN}"
}

# 🧯 安全解析函数
def safe_json_parse(obj):
    try:
        if isinstance(obj, str):
            return json.loads(obj)
        return obj
    except Exception:
        return obj

# 🚀 发起请求
response = requests.post(API_URL, headers=headers, json=payload)

# 📦 解包响应
if response.status_code == 200:
    try:
        res_data = response.json()
        print("📥 原始响应：", res_data)

        output = res_data.get("data", {}).get("output")
        outer = safe_json_parse(output)
        inner = safe_json_parse(outer.get("output")) if isinstance(outer, dict) else outer
        result = inner if isinstance(inner, dict) else {}

        print("\n✅ 模型识别结果：")
        print(f"判断       ：{result.get('判断', '未知')}")
        print(f"类型       ：{result.get('类型', '未知')}")
        print(f"风险等级   ：{result.get('风险等级', '未知')}")
        print(f"可信度     ：{result.get('可信度', '未知')}")
        print(f"判断依据   ：{result.get('判断依据', '')}")
        print("类似诈骗短信：")
        for example in result.get('类似诈骗短信', []):
            print(f"- {example}")
    except Exception as e:
        print("❌ 解包失败：", e)
        print("原始内容：", response.text)
else:
    print(f"❌ 请求失败，状态码：{response.status_code}")
    print(response.text)
